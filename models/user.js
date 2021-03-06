const db = require('../util/database')

module.exports = class User {
  constructor(id, user_name, first_name, last_name, birth_date, password, email, isVerified) {
    this.id = id
    this.user_name = user_name
    this.first_name = first_name
    this.last_name = last_name
    this.birth_date = birth_date
    this.password = password
    this.email = email
    this.isVerified = isVerified
  }

  create() {
    return db.execute(
      'INSERT INTO users (user_name, first_name, last_name, birth_date, password, email) VALUES ( ?, ?, ?, ?, ?, ?)',
      [this.user_name, this.first_name, this.last_name, this.birth_date, this.password, this.email]
    );
  }

  save() {
    return db.execute(
      'UPDATE users SET user_name = ?, first_name = ?, last_name = ?, birth_date = ?, password = ?, email = ? WHERE id = ?',
      [this.user_name, this.first_name, this.last_name, this.birth_date, this.password, this.email, this.id]
    );
  }

  static deleteById(id) {
    return db.execute('DELETE FROM users WHERE id = ?', [id])
  }

  static fetchAll() {
    return db.execute('SELECT * FROM users');
  }

  static findById(id) {
    return db.execute('SELECT * FROM users WHERE id = ?', [id]);
  }

  static findByUsername(user_name) {
    return db.execute('SELECT * FROM users WHERE user_name = ?', [user_name]);
  }

  static isUnique(user_name, email) {
    const errorMessages = {error: null, messages: []}
    return db.execute('SELECT * FROM users WHERE user_name = ? OR email = ?', [user_name, email])
    .then(result => {
      for (let i = 0; i < result[0].length; i++) {
        if (result[0][i].user_name === user_name ) {
          errorMessages.error = true
          errorMessages.messages.push({type: 'duplicateUserName', message: "This username already exists"})
        } 
        if (result[0][i].email === email) {
          errorMessages.error = true
          errorMessages.messages.push({type: 'duplicateEmail', message: "This email already exists"})
        }
      }
      return errorMessages
    })
  }
};
