import * as Yup from 'yup';
import DeliveryProblem from '../models/DeliveryProblem';
import Delivery from '../models/Delivery';

class DeliveryProblemController {
  async show(req, res) {
    const { page = 1 } = req.query;
    const delivery = await Delivery.findByPk(req.params.deliveryId);
    // delivery/:deliveryId/problems
    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not exists.' });
    }

    const problems = await DeliveryProblem.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      where: {
        delivery_id: delivery.id,
      },
    });

    if (!problems) {
      return res
        .status(200)
        .json({ error: 'There are no problems for this delivery' });
    }

    return res.json(problems);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      delivery_id: Yup.number().required(),
      description: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const deliveryExists = await Delivery.findOne({
      where: {
        deliveryman_id: req.params.deliverymanId,
        id: req.body.delivery_id,
      },
    });
    if (!deliveryExists) {
      return res.status(400).json({
        error: `Delivery man or delivery doesn’t exist or you are trying acess  delivery another deliveryman’s`,
      });
    }

    // console.log(JSON.stringify(delivery));

    const { id, delivery_id, description } = await DeliveryProblem.create(
      req.body
    );

    return res.json({
      id,
      delivery_id,
      description,
    });
  }
}

export default new DeliveryProblemController();
