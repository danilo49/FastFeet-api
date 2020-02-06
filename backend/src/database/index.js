import Sequelize from 'sequelize';

import User from '../app/models/User';
import Recipient from '../app/models/Recipient';
import File from '../app/models/File';
import Deliveryman from '../app/models/Deliveryman';
import Delivery from '../app/models/Delivery';

import databaseConfig from '../config/database';

const models = [User, Recipient, File, Deliveryman, Delivery];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig); // connection to the database is made here

    models
      .map(model => model.init(this.connection)) // loading bank users into the application
      .map(model => model.associate && model.associate(this.connection.models)); // loading bank files for application
  }
}

export default new Database();
