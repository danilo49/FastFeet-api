import * as Yup from 'yup';
import Op from 'sequelize';
import { startOfDay, endOfDay, parseISO, getHours, isPast } from 'date-fns';
import Delivery from '../models/Delivery';

class WithdrawalController {
  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { delivery_id, deliveryman_id, start_date } = req.body;

    const delivery = await Delivery.findByPk(delivery_id);
    // console.log(JSON.stringify(delivery));

    if (!delivery) {
      return res.status(401).json({
        error: 'You can only create withdrawal with deliveries exists',
      });
    }
    if (delivery.start_date) {
      return res.status(400).json({ error: 'Delivery has alredy started' });
    }

    /**
     * Check for past dates
     */
    const parsedDate = parseISO(start_date); // parseISO convert date to object
    const hour = getHours(parsedDate);
    if (isPast(parsedDate)) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }
    // console.log(JSON.stringify(hour));
    /**
     * Check quantity availability
     */
    if (hour < 8 || hour >= 18) {
      return res.json({
        error:
          'Order collection is currently not allowed. Return between 8 and 18 hours.',
      });
    }
    const checkAvailability = await Delivery.findAll({
      where: {
        deliveryman_id,
        start_date: {
          [Op.between]: [startOfDay(parsedDate), endOfDay(parsedDate)],
        },
      },
    });
    console.log('All deliverys:', JSON.stringify(checkAvailability, null, 2));

    if (checkAvailability.length >= 5) {
      return res.status(400).json({
        error: 'Five withdrawals limit reached, return the next business day.',
      });
    }

    await delivery.update({ start_date });

    return res.json(delivery);
  }

  async update(req, res) {
    console.log('entrou');
    const delivery = await Delivery.findByPk(req.params.deliveryId);

    if (!delivery) {
      return res.status(401).json({
        error: 'You can only create withdrawal with deliveries exists',
      });
    }

    const schema = Yup.object().shape({
      deliveryman_id: Yup.number().required(),
      end_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const { end_date } = req.body;

    if (!delivery.start_date) {
      return res
        .status(401)
        .json({ error: 'Unable to finalize an uninitiated order' });
    }

    await delivery.update({ end_date });

    return res.json(delivery);
  }
}

export default new WithdrawalController();
