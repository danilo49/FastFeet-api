import Sequelize, { Model } from 'sequelize';

class Problem extends Model {
  static init(sequelize) {
    super.init(
      {
        // delivery_id: Sequelize.INTEGER,
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
    this.hasMany(models.Delivery, { foreignKey: 'id' });
  }
}
export default Problem;
