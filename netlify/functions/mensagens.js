const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  try {
    const sql = neon(process.env.NETLIFY_DATABASE_URL);

    const mensagens = await sql`
      SELECT * FROM mensagens ORDER BY criado_em DESC
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ mensagens })
    };

  } catch (erro) {
    console.error('Erro:', erro);
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: 'Erro ao buscar mensagens.' })
    };
  }
};
