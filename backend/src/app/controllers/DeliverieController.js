import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';

class DeliverieController {
  async index(req, res) {
    const deliveryman = await Deliveryman.findByPk(req.params.deliverymanId);
    if (!deliveryman) {
      return res.status(400).json({ error: 'Delivery man does not exist!' });
    }
    const deliveries = await Delivery.findAll({
      where: {
        deliveryman_id: deliveryman.id,
        canceled_at: null,
        end_date: null,
      },
    });
    if (!deliveries) {
      return res.status(400).json({
        error: 'There are no deliveries available for this delivery person!',
      });
    }
    console.log(JSON.stringify(deliveryman));

    return res.json(deliveries);
  }
}

export default new DeliverieController();
