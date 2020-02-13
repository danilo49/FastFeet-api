import * as Yup from 'yup';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliverymanController {
  async index(req, res) {
    const deliverymen = await Deliveryman.findAll({
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });
    return res.json(deliverymen);
  }

  async store(req, res) {
    /**
     * Validate body
     */
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .required()
        .email(),
      avatar_id: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation error' });
    }

    /**
     * Check if email is alredy registered
     */
    const deliverymanExists = await Deliveryman.findOne({
      where: { email: req.body.email },
    });
    if (deliverymanExists) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const deliveryman = await Deliveryman.create(req.body);

    return res.status(200).json(deliveryman);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      // formart the req.body
      name: Yup.string(),
      email: Yup.string().email(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const deliveryman = await Deliveryman.findByPk(req.userId);
    const { email } = req.body;

    if (email && email !== deliveryman.email) {
      const deliverymanExists = await Deliveryman.findOne({
        where: { email },
      }); // check if there is already an equal email in the database before updating the user

      if (!deliverymanExists) {
        return res.status(400).json({ error: 'Delivery man does not exist.' });
      }
    }
    const { id, name, avatar_id } = await deliveryman.update(req.body);
    return res.json({
      id,
      name,
      email,
      avatar_id,
    });
  }

  async delete(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.id);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man does not exist.' });
    }

    await deliveryman.destroy({
      where: deliveryman.id,
    });
    return res.json({ ok: 'Successfully deleted deliveryman.' });
  }
}

export default new DeliverymanController();
