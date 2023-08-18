import { modelCart } from "../DAO/models/db/carts.model.db.js";

export function isAmdin(req, res, next) {
  if(req.session.email && req.session.admin == true) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'please log in as ADMIN!' });
}

export function isUser(req, res, next) {
  if (req.session.email) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'please log in!' });
}

export function isUserNotAdmin(req, res, next) { //falta asignarlo al chat
  if (req.session.email && req.session.admin == false) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'please log in USER NOT ADMIN!' });
}

export async function isUserOwner(req, res, next) {
  const cart = await modelCart.getCart(req.params.cid);
  if (req.user.email && req.user._id.toString()===cart.user.toString()) {
    return next();
  }
  return res.status(401).render('error-page', { msg: 'please log in AS ADMIN!' });
}