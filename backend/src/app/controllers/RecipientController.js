import * as Yup from 'yup'; // validating input data
import Recipient from '../models/Recipient';

class RecipientController {
  async store(req, res) {
    // validating input data
    const schema = Yup.object().shape({
      // formart the req.body
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      neighborhood: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    /*
    // Recipient registration
    const recipientExists = await Recipient.findAll({
      where: {
        name: req.body.name,
        street: req.body.street,
        number: req.body.number,
        complement: req.body.complement,
        state: req.body.state,
        city: req.body.city,
      },
    }); // check before registering the recipient, if there is already an identical recipient in the database

    if (recipientExists) {
      return res.status(400).json({ error: 'Recipient already exists.' });
    }
    */
    const {
      id,
      name,
      street,
      number,
      neighborhood,
      complement,
      state,
      city,
      zipcode,
    } = await Recipient.create(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      neighborhood,
      complement,
      state,
      city,
      zipcode,
    });
  }

  async update(req, res) {
    const { id } = req.params;

    const schema = Yup.object().shape({
      // formart the req.body
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      neighborhood: Yup.string().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.number().required(),
    });

    const recipient = await Recipient.findOne({
      where: { id },
    });

    if (!(await schema.isValid(req.body && recipient))) {
      return res.status(400).json({ error: 'Validation fails' });
    }
    const {
      name,
      street,
      number,
      neighborhood,
      complement,
      state,
      city,
      zipcode,
    } = await recipient.update(req.body);

    return res.json({
      id,
      name,
      street,
      number,
      neighborhood,
      complement,
      state,
      city,
      zipcode,
    });
  }
}
export default new RecipientController();
