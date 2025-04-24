import Shurjopay from 'shurjopay';
import config from '../../config';

const shurjopay = new Shurjopay();

shurjopay.config(
  config.sp.sp_endpoint!,
  config.sp.sp_username!,
  config.sp.sp_password!,
  config.sp.sp_prefix!,
  config.sp.sp_return_url!
);

const makePaymentAsync = async (paymentPayload: any): Promise<any> => {
  return new Promise((resolve, reject) => {
    shurjopay.makePayment(
      paymentPayload,
      (response) => {
        if (response.checkout_url) {
          resolve(response);
        } else {
          console.error('Checkout URL not found in payment response:', response);
          reject(new Error('Checkout URL not found in payment response'));
        }
      },
      (error) => {
        console.error('Payment request failed:', error);
        reject(error);
      }
    );
  });
};

const verifyPaymentAsync = (order_id: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    shurjopay.verifyPayment(
      order_id,
      (response) => resolve(response),
      (error) => reject(error)
    );
  });
};

export const orderUtils = {
  makePaymentAsync,
  verifyPaymentAsync,
};