import express from 'express';
import validateRequest from '../helpers/validation';
import rideOfferController from '../controllers/rideOffer';
import requestRideController from '../controllers/requests';

// using router routes
const router = express.Router();

/** ****************** MY API ENDPOINTS *************** */

// Welcome message route
router.get('/', (req, res) => {
  const rootMessage = {
    message: 'Welcome to Ride-My-Way app! Your one stop place to get rides to your desired destination at reasonable prices',
  };
  res.status(200).json(rootMessage);
});

// Create a ride offer
router.post(
  '/rides',
  validateRequest.removeWhiteSpaces,
  validateRequest.checkBodyContains('title', 'driverName', 'destination', 'deparTerminal', 'date', 'fee'),
  validateRequest.confirmDate,
  validateRequest.confirmFeeType,
  rideOfferController.createRideOffer,
);

// Get all ride offers
router.get('/rides', rideOfferController.getAllRideOffer);

// Get one ride offer
router.get('/rides/:rideId', rideOfferController.getOneRideOffer);

// Deletes a ride offer
router.delete('/rides/:rideId', rideOfferController.deleteRideOffer);

// Edits a ride offer
router.put('/rides/:rideId', rideOfferController.modifyRideOffer);

// Requests for a ride offer
router.post(
  '/rides/:rideId/requests',
  validateRequest.removeWhiteSpaces,
  validateRequest.checkBodyContains('requester'),
  requestRideController.makeRequestForRide
);

// Get all the requests for a ride offer
router.get('/rides/:rideId/requests', requestRideController.getAllRequestsForRide);

// Gets the status of aa requests for a ride offer
router.get('/rides/:rideId/requests/:requestId/status', requestRideController.checkRequestStatus);

// 404 route
router.all('*', (req, res) => {
  res.status(404).send({ message: 'That route does not exist!' });
});

export default router;