module.exports = {
  dialect: 'postgres',
  host: 'localhost',
  username: 'postgres',
  password: 'docker',
  database: 'fastfeet',
  port: 5433,
  define: {
    timestamps: true, // created_at e updated_at dentro de cada tabela do banco de dados
    underscored: true,
    underscoredAll: true,
  },
};
