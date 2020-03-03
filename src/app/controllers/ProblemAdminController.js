// import Op from 'sequelize';
import DeliveryProblem from '../models/DeliveryProblem';
import Recipient from '../models/Recipient';
import File from '../models/File';
import Delivery from '../models/Delivery';
import CancellationMail from '../jobs/CancellationMail';
import Deliveryman from '../models/Deliveryman';

import Queue from '../../lib/Queue';

class ProblemAdminController {
  async index(req, res) {
    const { page = 1 } = req.query;
    const problems = await DeliveryProblem.findAll({
      attributes: ['delivery_id'],
    });
    const idsWithProblems = problems.map(p => p.delivery_id);
    const deliveries = await Delivery.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      where: {
        id: idsWithProblems,
      },
      attributes: ['id', 'product', 'start_date', 'end_date'],
      include: [
        {
          model: Recipient,
          as: 'recipient',
          attributes: [
            'id',
            'name',
            'street',
            'number',
            'zipcode',
            'complement',
            'state',
            'city',
          ],
        },
        {
          model: Deliveryman,
          as: 'deliveryman',
          attributes: ['id', 'name', 'email'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
        {
          model: File,
          as: 'signature',
          attributes: ['name', 'path', 'url'],
        },
      ],
    });

    return res.status(200).json(deliveries);
  }

  async delete(req, res) {
    const problem = await DeliveryProblem.findByPk(req.params.id);
    if (!problem) {
      return res.status(400).json('Problem does not exist');
    }
    const delivery = await Delivery.findOne({
      where: {
        id: problem.delivery_id,
      },
    });
    if (!delivery) {
      return res.status(400).json('Delivery does not exist');
    }
    delivery.canceled_at = new Date();

    const {
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
    } = await delivery.update();

    const deliveryman = await Deliveryman.findOne({
      where: { id: deliveryman_id },
    });

    await Queue.add(CancellationMail.key, {
      deliveryman,
      product,
      canceled_at,
    });

    return res.json({
      id,
      recipient_id,
      deliveryman_id,
      signature_id,
      product,
      canceled_at,
      start_date,
    });
  }
}

export default new ProblemAdminController();
