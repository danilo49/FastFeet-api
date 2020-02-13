import Sequelize, { Model } from 'sequelize';

class Delivery extends Model {
  static init(sequelize) {
    super.init(
      {
        // recipient_id: Sequelize.INTEGER,
        // deliveryman_id: Sequelize.INTEGER,
        // signature_id: Sequelize.INTEGER,
        product: Sequelize.STRING,
        canceled_at: Sequelize.DATE,
        start_date: Sequelize.DATE,
        end_date: Sequelize.DATE,
      },
      {
        sequelize,
        tableName: 'deliverys',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.File, {
      foreignKey: 'id',
      as: 'signature',
    });
    this.hasMany(models.Deliveryman, {
      foreignKey: 'id',
      as: 'deliveryman',
    });
    this.belongsTo(models.Recipient, {
      foreignKey: 'id',
      as: 'recipient',
    });
  }
}
export default Delivery;
