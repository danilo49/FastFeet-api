import Op from 'sequelize';
import Problem from '../models/Problem';
import Delivery from '../models/Delivery';
import CancellationMail from '../jobs/CancellationMail';
import Deliveryman from '../models/Deliveryman';

import Queue from '../../lib/Queue';

class ProblemAdminController {
  async index(req, res) {
    const { page } = req.query;
    const problems = await Problem.findAll();
    const deliveriesWithProblems = await Delivery.findAll({
      where: { id: problems.delivery_id, canceled_at: null },
      order: ['date'],
      attributes: [
        'id',
        'recipient_id',
        'deliveryman_id',
        'signature_id',
        'product',
        'start_date',
        'end_date',
      ],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Problem,
          as: 'delivery_problems',
          attributes: ['delivery_id', 'description'],
          /* include: [
            {
              model: File,
              as: 'signature',
              attributes: ['id', 'path', 'url'],
            },
          ], */
        },
      ],
    });
    return res.json({ deliveriesWithProblems });
  }

  async delete(req, res) {
    const problem = await Problem.findByPk(req.params.id);
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
