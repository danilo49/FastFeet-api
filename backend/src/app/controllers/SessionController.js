import jwt from 'jsonwebtoken'; // JWT authentication
import * as Yup from 'yup';
import User from '../models/User';

import authConfig from '../../config/auth';

class SessionController {
  async store(req, res) {
    // validating input data
    const schema = Yup.object().shape({
      // formart the req.body
      email: Yup.string()
        .email()
        .required(),
      password: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'User not found' }); // email not found
    }
    if (!(await user.checkPassword(password))) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const { id, name } = user;

    return res.json({
      user: {
        id,
        name,
        email,
      },
      // payload(id) sao informacoes que vc quer utilizar
      // header = algoritmo pessoal md5 online
      // assinatura= quantos dias para expirar o token
      token: jwt.sign({ id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

export default new SessionController();
