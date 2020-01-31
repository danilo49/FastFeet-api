import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';

import databaseConfig from '../config/database';

const models = [User, Recipient];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // conexão com a base de dados é feita por aqui

    models.map(model => model.init(this.connection)); // carregando os usuarios do banco para a aplicacao
  }
}

export default new Database();
