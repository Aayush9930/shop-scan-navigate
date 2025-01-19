interface UPCProduct {
  title: string;
  price: string;
  currency: string;
  url: string;
}

const ACCESS_TOKEN = '9C97CFC4-55AE-44E2-AC08-260BEE58C84E';
const API_URL = 'https://www.searchupc.com/handlers/upcsearch.ashx';

export const getProductDetails = async (barcode: string): Promise<UPCProduct[]> => {
  console.log('Fetching product details for barcode:', barcode);
  
  try {
    const response = await fetch(
      `${API_URL}?request_type=3&access_token=${ACCESS_TOKEN}&upc=${barcode}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch product details');
    }

    const data = await response.json();
    console.log('API Response:', data);

    // Transform the data to match our interface
    return data.map((item: any) => ({
      title: item.productname || 'Unknown Product',
      price: item.price || 'N/A',
      currency: item.currency || 'USD',
      url: item.producturl || '#'
    }));
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
}