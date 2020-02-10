import pt from 'date-fns/locale/pt';
import { format } from 'date-fns';
import Mail from '../../lib/Mail';

class OrderAvailableMail {
  get key() {
    return 'OrderAvailableMail';
  }

  async handle({ data }) {
    const { deliverymanExists, product } = data;
    console.log(`${deliverymanExists.name} produto ${product}`);

    await Mail.sendMail({
      to: `${deliverymanExists.name} <${deliverymanExists.email}>`,
      subject: 'Nova encomenda disponível para retirada',
      template: 'order',
      context: {
        deliveryman: deliverymanExists.name,
        product,
        date: format(new Date(), "'dia' dd 'de' MMMM', às' H:mm'h", {
          locale: pt,
        }),
      },
    });
  }
}

export default new OrderAvailableMail();
