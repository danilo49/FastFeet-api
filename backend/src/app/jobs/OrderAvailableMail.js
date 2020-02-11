import pt from 'date-fns/locale/pt';
import { format } from 'date-fns';
import Mail from '../../lib/Mail';

class OrderAvailableMail {
  get key() {
    return 'OrderAvailableMail';
  }

  async handle({ data }) {
    const { deliverymanExists, recipientExists, product } = data;
    // console.log(`${deliveryman.name} produto ${product}`);

    await Mail.sendMail({
      to: `${deliverymanExists.name} <${deliverymanExists.email}>`,
      subject: 'Nova encomenda disponível para retirada',
      template: 'order',
      context: {
        deliveryman: deliverymanExists.name,
        recipient: recipientExists.name,
        street: recipientExists.street,
        number: recipientExists.number,
        complement: recipientExists.complement,
        neighborhood: recipientExists.neighborhood,
        zipcode: recipientExists.zipcode,
        city: recipientExists.city,
        state: recipientExists.state,
        product,
        date: format(new Date(), "'dia' dd 'de' MMMM', às' H:mm'h", {
          locale: pt,
        }),
      },
    });
  }
}

export default new OrderAvailableMail();
