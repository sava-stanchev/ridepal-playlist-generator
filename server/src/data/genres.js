import pool from "./pool.js";

const getGenreByName = async (name) => {
  const sql = `
    SELECT * 
    FROM genres 
    WHERE name = ?
  `;

  try {
    const [result] = await pool.query(sql, [name]);
    return result.length > 0 ? result[0] : null;
  } catch (error) {
    console.error("Error fetching genre by name:", error);
    throw new Error("Database query failed");
  }
};

export default {
  getGenreByName,
};
