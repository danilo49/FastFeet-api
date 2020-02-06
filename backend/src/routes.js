import { Router } from 'express';
import multer from 'multer';
import multerConfig from './config/multer';

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import RecipientController from './app/controllers/RecipientController';
import DeliverymanController from './app/controllers/DeliverymanController';
import DeliveryController from './app/controllers/DeliveryController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';
import authAdmin from './app/middlewares/authAdmin';

const routes = new Router();
const upload = multer(multerConfig);

routes.post('/users', UserController.store);
routes.post('/sessions', SessionController.store);

routes.use(authMiddleware); // Middleware GLOBAL the routes below this line pass through the middleware
// routes.put('/users', authMiddleware, UserController.update); Middleware LOCAL
routes.put('/users', UserController.update);

// -------- Administrator Features --------
routes.use(authAdmin);
routes.post('/recipients', RecipientController.store);
routes.put('/recipients/:id', RecipientController.update);

routes.post('/files', upload.single('file'), FileController.store);

routes.get('/deliveryman', DeliverymanController.index);
routes.post('/deliveryman', DeliverymanController.store);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

routes.get('/deliverys', DeliveryController.index);
routes.post('/deliverys', DeliveryController.store);
routes.put('/deliverys/:id', DeliveryController.update);
routes.delete('/deliverys/:id', DeliveryController.delete);
// ----------------------------------------
export default routes;

// *********** Atalhos ******************************
// Ctrl + enter / adiciona comentarios
// Ctrl k Ctrl C comenta a linha atual
// Ctrl k Ctrl u descomenta a linha atual
// Ctrl k Ctrl s show keyboards shotcuts
// Ctrl Alt k copia a linha atual na de baixo
// Ctrl Shift k apaga linha atual
// **************************************************
