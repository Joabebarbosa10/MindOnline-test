// netlify/functions/mensagens.js
// Instale o driver: npm install @neondatabase/serverless
// Configure a variável de ambiente DATABASE_URL no painel da Netlify

import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

export async function handler(event) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json',
  };

  // Preflight CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  try {
    // ── GET: admin busca todas as mensagens ──────────────────────────
    if (event.httpMethod === 'GET') {
      const rows = await sql`
        SELECT id, nome, telefone, email, novidades, mensagem, criado_em
        FROM mensagens
        ORDER BY criado_em DESC
      `;
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ mensagens: rows }),
      };
    }

    // ── POST: formulário envia nova mensagem ─────────────────────────
    if (event.httpMethod === 'POST') {
      const { nome, telefone, email, novidades, mensagem } = JSON.parse(event.body || '{}');

      // Validação mínima
      if (!nome?.trim() || !email?.trim() || !mensagem?.trim()) {
        return {
          statusCode: 400,
          headers,
          body: JSON.stringify({ erro: 'Campos obrigatórios ausentes.' }),
        };
      }

      await sql`
        INSERT INTO mensagens (nome, telefone, email, novidades, mensagem)
        VALUES (
          ${nome.trim()},
          ${telefone?.trim() || null},
          ${email.trim()},
          ${novidades || 'nao'},
          ${mensagem.trim()}
        )
      `;

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify({ ok: true }),
      };
    }

    return { statusCode: 405, headers, body: JSON.stringify({ erro: 'Método não permitido.' }) };

  } catch (err) {
    console.error('[mensagens fn]', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ erro: 'Erro interno. Tente novamente.' }),
    };
  }
}