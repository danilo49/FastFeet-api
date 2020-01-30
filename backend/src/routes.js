import { Router } from 'express';

// import User from './app/models/User';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

const routes = new Router();

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // Middleware GLOBAL as rotas abaixo desta linha passaram pelo middleware
// routes.put('/users', authMiddleware, UserController.update); Middleware LOCAL
routes.put('/users', UserController.update);

/* routes.get('/', async (req, res) => {
  const user = await User.create({
    name: 'Danilo Pereira',
    email: 'danilopx@gmail.com',
    password_hash: '1231423',
  });

  return res.json(user);
});
*/
export default routes;

// *********** Atalhos ******************************
// Ctrl + enter / adiciona comentarios
// Ctrl k Ctrl C comenta a linha atual
// Ctrl k Ctrl u descomenta a linha atual
// Ctrl k Ctrl s show keyboards shotcuts
// Ctrl Alt k copia a linha atual na de baixo
// Ctrl Shift k apaga linha atual
// **************************************************
