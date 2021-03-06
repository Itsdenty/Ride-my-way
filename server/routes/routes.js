import express from 'express';
import auth from '../helpers/auth';
import validateRequest from '../helpers/validation';
import userController from '../controllers/user';
import ifRideOfferExists from '../helpers/isRideExists';
import rideOfferController from '../controllers/rideOffer';
import requestRideController from '../controllers/requests';
import idValidator from '../helpers/isIdValid';
import ifRequestExist from '../helpers/requestExist';
import ifUserExist from '../helpers/isUserExists';

// using router routes
const router = express.Router();

/** ****************** MY API ENDPOINTS *************** */

// signs up a user
router.post(
  '/auth/signup',
  validateRequest.trimsRequestBody,
  validateRequest.checkBodyContains('firstname', 'lastname', 'phoneno', 'username', 'email', 'password'),
  validateRequest.confirmEmail,
  validateRequest.checkIfString('firstname', 'lastname', 'username', 'email', 'password'),
  ifUserExist,
  userController.createUser
);

// logs in a user
router.post(
  '/auth/login',
  validateRequest.trimsRequestBody,
  validateRequest.checkBodyContains('email', 'password'),
  validateRequest.confirmEmail,
  validateRequest.checkIfString('email', 'password'),
  userController.loginUser
);


// Create a ride offer
router.post(
  '/users/rides',
  auth.authenticate,
  validateRequest.trimsRequestBody,
  validateRequest.checkBodyContains('message', 'destination', 'departurelocation', 'date'),
  validateRequest.checkIfString('message', 'destination', 'departurelocation', 'date'),
  ifRideOfferExists,
  rideOfferController.createRideOffer
);

// Get all ride offers
router.get('/rides', rideOfferController.getAllRideOffer);

// Get one ride offer
router.get(
  '/rides/:rideId',
  idValidator,
  auth.authenticate,
  rideOfferController.getOneRideOffer
);

// Requests for a ride offer
router.post(
  '/rides/:rideId/requests',
  idValidator,
  auth.authenticate,
  ifRequestExist,
  requestRideController.makeRequestForRide
);

// Get all the requests for a ride offer
router.get(
  '/users/rides/:rideId/requests',
  idValidator,
  auth.authenticate,
  requestRideController.getAllRequestsForRide
);

// Accepts or rejects a ride offer
router.put(
  '/users/rides/:rideId/requests/:requestId',
  idValidator,
  auth.authenticate,
  validateRequest.trimsRequestBody,
  validateRequest.checkBodyContains('status'),
  requestRideController.updateRequestStatus
);

// 404 route
router.all('*', (req, res) => {
  const errorMessage = {
    message: 'You are hitting a wrong route, find the valid routes below',
    endpoints: {
      signup: 'POST /api/v1/auth/signup',
      login: 'POST /api/v1/auth/login',
      getAllRideOffer: 'GET /api/v1/rides',
      getOneRideOffer: 'GET /api/v1/rides/:rideId',
      makeRequestForRide: 'POST /api/v1/rides/:rideId/requests',
      createRideOffer: 'POST /api/v1/users/rides',
      getAllRequestsForRide: 'GET /api/v1/GET /users/rides/:rideId/requests',
      acceptRejectRequests: 'PUT /api/v1//users/rides/:rideId/requests/:requestId'
    },
    success: false
  };
  res.status(404).json(errorMessage);
});

export default router;

