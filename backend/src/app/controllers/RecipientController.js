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
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.number().required(),
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
      complement,
      state,
      city,
      zipcode,
    });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      // formart the req.body
      name: Yup.string().required(),
      street: Yup.string().required(),
      number: Yup.number().required(),
      complement: Yup.string(),
      state: Yup.string().required(),
      city: Yup.string().required(),
      zipcode: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    // Recipient update
    // console.log(reqIuserId);
    // const { email, oldPassword } = req.body;

    const recipient = await Recipient.findByPk(req.userId);
    /*
    if (email && email !== recipient.email) {
      const userExists = await Recipient.findOne({
        where: { email },
      }); // check if there is already an equal email in the database before updating the user

      if (userExists) {
        return res.status(400).json({ error: 'User already exists.' });
      }
    }

    if (oldPassword && !(await recipient.checkPassword(oldPassword))) {
      // Just make sure that the old password corresponds to a record in the database, if he enters the password, otherwise it will not enter the case, as there is no more old password
      return res.status(401).json({ error: 'Password does not match' });
    }
    */
    const {
      id,
      name,
      street,
      number,
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
      complement,
      state,
      city,
      zipcode,
    });
  }
}

export default new RecipientController();
