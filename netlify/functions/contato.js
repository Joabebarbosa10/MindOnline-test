const { neon } = require('@neondatabase/serverless');

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Método não permitido' };
  }

  try {
    const { nome, telefone, email, novidades, mensagem } = JSON.parse(event.body);

    if (!nome || !email || !mensagem) {
      return {
        statusCode: 400,
        body: JSON.stringify({ erro: 'Preencha todos os campos obrigatórios.' })
      };
    }

    const sql = neon(process.env.DATABASE_URL);

    await sql`
      CREATE TABLE IF NOT EXISTS mensagens (
        id        SERIAL PRIMARY KEY,
        nome      TEXT NOT NULL,
        telefone  TEXT,
        email     TEXT NOT NULL,
        novidades TEXT,
        mensagem  TEXT NOT NULL,
        criado_em TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      INSERT INTO mensagens (nome, telefone, email, novidades, mensagem)
      VALUES (${nome}, ${telefone}, ${email}, ${novidades}, ${mensagem})
    `;

    return {
      statusCode: 200,
      body: JSON.stringify({ sucesso: 'Mensagem enviada com sucesso!' })
    };

  } catch (erro) {
    console.error('Erro:', erro);
    return {
      statusCode: 500,
      body: JSON.stringify({ erro: 'Erro interno. Tente novamente.' })
    };
  }
};