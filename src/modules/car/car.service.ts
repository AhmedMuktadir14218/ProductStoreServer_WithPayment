import Car from './car.model';
import { ICar } from './car.interface';
import { uploadImage } from '../../utils/imageUpload';


export const createCar = async (carData: ICar) => {
  try {
    // Upload the car image to ImageBB (or Cloudinary or other services)
    // const carImageUrl = await uploadImage(carImageBase64);  // This should return the image URL

    // Create a new car with the uploaded image URL
    const newCar = await Car.create({
      ...carData // Store the image URL in the car document
    });

    return newCar;
  } catch (error) {
    throw new Error('Error uploading image or creating car');
  }
};



// latest but not worked 
// Create car with image
// export const createCar = async (carData: Omit<ICar, 'imageUrl'>, imageBase64: string): Promise<ICar> => {
//   try {
//     // Upload the image to Cloudinary
//     const imageUrl = await uploadImage(imageBase64);  // Call the image upload function

//     // Create the car in the database
//     const newCar = new Car({
//       ...carData,
//       imageUrl,  // Store the Cloudinary image URL
//     });

//     // Save the car to the database
//     const savedCar = await newCar.save();

//     return savedCar;
//   } catch (error) {
//     throw new Error('Error uploading image or saving car data');
//   }
// };



export const getCars = async (searchTerm?: string, page: number = 1, limit: number = 10) => {
  const query = searchTerm
    ? {
        $or: [
          { brand: { $regex: searchTerm, $options: 'i' } },
          { model: { $regex: searchTerm, $options: 'i' } },
          { category: { $regex: searchTerm, $options: 'i' } },
        ],
      }
    : {};

  const cars = await Car.find(query)
    .skip((page - 1) * limit)
    .limit(limit);

  const totalCars = await Car.countDocuments(query);

  return {
    cars,
    totalPages: Math.ceil(totalCars / limit),
    currentPage: page,
    totalCars,
  };
};

export const getCarById = async (carId: string) => {
  const car = await Car.findById(carId);
  if (!car) throw new Error('Car not found');
  return car;
};

export const updateCar = async (carId: string, updateData: Partial<ICar>) => {
  const car = await Car.findByIdAndUpdate(carId, updateData, {
    new: true,
    runValidators: true,
  });
  if (!car) throw new Error('Car not found');
  return car;
};

export const deleteCar = async (carId: string) => {
  const car = await Car.findByIdAndDelete(carId);
  if (!car) throw new Error('Car not found');
  return car;
};
