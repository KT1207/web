exports.createUserSql = () => {
  return `create table if not exists user(
    userid text primary key,
    password text not null
  )`;
};

exports.selectOneUserSql = (userid) => {
  return `select * from user where userid='${userid}'`;
};

exports.selectAllUserSql = () => {
  return `select * from user`;
};

exports.insertUser = (user) => {
  return `insert into user(userid, password) values (
    '${user.userid}',
    '${user.password}'
  )`;
};

exports.deleteUserSql = (userid) => {
  return `delete from user where userid='${userid}'`;
};
