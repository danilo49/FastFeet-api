import Sequelize, { Model } from 'sequelize';

class Problem extends Model {
  static init(sequelize) {
    super.init(
      {
        delivery_id: Sequelize.INTEGER,
        description: Sequelize.STRING,
      },
      {
        sequelize,
        tableName: 'delivery_problems',
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Delivery, { foreignKey: 'id', as: 'delivery' });
  }
}
export default Problem;
