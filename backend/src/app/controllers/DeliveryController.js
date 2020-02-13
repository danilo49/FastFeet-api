import * as Yup from 'yup';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';
import Recipient from '../models/Recipient';

import OrderAvailableMail from '../jobs/OrderAvailableMail';
import Notification from '../schemas/Notification';
import Queue from '../../lib/Queue';

class DeliveryController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const deliverys = await Delivery.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      where: { canceled_at: null },
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'product',
        'start_date',
        'end_date',
      ],
      include: [
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
        {
          model: Recipient,
          as: 'recipient',
          attributes: ['name', 'street', 'number'],
        },
      ],
    });
    return res.json(deliverys);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.number(),
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliverymanExists = await Deliveryman.findOne({
      where: { id: req.body.deliveryman_id },
    });

    const recipientExists = await Recipient.findOne({
      where: { id: req.body.recipient_id },
    });

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'The deliveryman does not exist.' });
    }

    if (!recipientExists) {
      return res.status(400).json({ error: 'The recipient does not exist.' });
    }

    const {
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await Delivery.create(req.body);

    const date = new Date();

    const formattedDate = format(date, "dd 'de' MMMM', às' H:mm'h", {
      locale: pt,
    });

    /**
     * E-mail deliveryman
     */
    await Queue.add(OrderAvailableMail.key, {
      deliverymanExists,
      recipientExists,
      product,
      date,
    });

    /**
     * Notify deliveryman
     */

    await Notification.create({
      content: `Olá ${deliverymanExists.name}!!!\nNova encomenda disponível para retirada.\nData/hora: ${formattedDate}`,
      user: req.body.deliveryman_id,
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      recipient_id: Yup.number().required(),
      deliveryman_id: Yup.number().required(),
      signature_id: Yup.number(),
      product: Yup.string().required(),
      canceled_at: Yup.date(),
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    const delivery = await Delivery.findOne({
      where: { id },
    });
    console.log(JSON.stringify(delivery, null, 4));

    if (!(await schema.isValid(req.body && delivery))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const deliverymanExists = await Deliveryman.findOne({
      where: { id: req.body.deliveryman_id },
    });

    const recipientExists = await Recipient.findOne({
      where: { id: req.body.recipient_id },
    });

    if (!deliverymanExists) {
      return res.status(400).json({ error: 'The deliveryman does not exist.' });
    }

    if (!recipientExists) {
      return res.status(400).json({ error: 'The recipient does not exist.' });
    }

    const {
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    } = await delivery.update(req.body);

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
      end_date,
    });
  }

  async delete(req, res) {
    const delivery = await Delivery.findByPk(req.params.id);
    console.log(JSON.stringify(delivery, null, 4));

    delivery.canceled_at = new Date();

    await delivery.save();
    return res.json(delivery);
  }
}

export default new DeliveryController();
