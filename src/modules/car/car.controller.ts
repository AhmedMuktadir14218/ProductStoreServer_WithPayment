import { Request, Response, NextFunction } from 'express';
import { createCar, getCarById, getCars, updateCar, deleteCar } from './car.service';

export const handleCreateCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const car = await createCar(req.body);
    res.status(201).json({
      message: 'Car created successfully',
      success: true,
      data: car,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('Unknown error occurred while creating a car'));
    }
  }
};


// export const handleCreateCar = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { brand, model, year, price, category, description, quantity, inStock } = req.body;
//     const carImageBase64 = req.body.imageBase64;  // Expect image to be sent as base64

//     // Check if all necessary fields are provided
//     if (!carImageBase64) {
//       return res.status(400).json({ message: 'Image is required.' });
//     }

//     // Create the car, which includes uploading the image and saving to the database
//     const car = await createCar(
//       ( brand , model, year, price, category, description, quantity, inStock ),
//       carImageBase64
//     );

//     res.status(201).json({
//       message: 'Car created successfully',
//       success: true,
//       data: car,
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       next(error);  // Pass the error to the next middleware for centralized error handling
//     } else {
//       next(new Error('Unknown error occurred while creating a car'));  // Handle unexpected errors
//     }
//   }
// };

// export const handleGetCars = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const searchTerm = req.query.searchTerm as string | undefined;
//     const cars = await getCars(searchTerm);
//     res.status(200).json({
//       message: 'Cars retrieved successfully',
//       success: true,
//       data: cars,
//     });
//   } catch (error) {
//     if (error instanceof Error) {
//       next(error);
//     } else {
//       next(new Error('Unknown error occurred while retrieving cars'));
//     }
//   }
// };


export const handleGetCars = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const searchTerm = req.query.searchTerm as string | undefined;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await getCars(searchTerm, page, limit);

    res.status(200).json({
      message: 'Cars retrieved successfully',
      success: true,
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const handleGetCarById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const car = await getCarById(req.params.carId);

    if (!car) {
      const error = new Error('Car not found');
      (error as any).statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Car retrieved successfully',
      success: true,
      data: car,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('Unknown error occurred while retrieving the car'));
    }
  }
};

export const handleUpdateCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const updatedCar = await updateCar(req.params.carId, req.body);

    if (!updatedCar) {
      const error = new Error('Car not found');
      (error as any).statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Car updated successfully',
      success: true,
      data: updatedCar,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('Unknown error occurred while updating the car'));
    }
  }
};

export const handleDeleteCar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deletedCar = await deleteCar(req.params.carId);

    if (!deletedCar) {
      const error = new Error('Car not found');
      (error as any).statusCode = 404;
      throw error;
    }

    res.status(200).json({
      message: 'Car deleted successfully',
      success: true,
    });
  } catch (error) {
    if (error instanceof Error) {
      next(error);
    } else {
      next(new Error('Unknown error occurred while deleting the car'));
    }
  }
};
