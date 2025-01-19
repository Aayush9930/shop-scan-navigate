import { XMLParser } from 'fast-xml2js';

const API_URL = 'https://www.searchupc.com/service/UPCSearch.asmx';
const ACCESS_TOKEN = ''; // You'll need to add your access token

interface UPCProduct {
  title: string;
  price: string;
  currency: string;
  url: string;
}

export const getProductDetails = async (barcode: string): Promise<UPCProduct[]> => {
  console.log('Fetching product details for barcode:', barcode);
  
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'text/xml;charset=UTF-8',
        'SOAPAction': 'http://searchupc.com/GetProductJSON',
      },
      body: `<?xml version="1.0" encoding="utf-8"?>
        <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
                      xmlns:xsd="http://www.w3.org/2001/XMLSchema" 
                      xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
          <soap:Body>
            <GetProductJSON xmlns="http://searchupc.com/">
              <upc>${barcode}</upc>
              <accesstoken>${ACCESS_TOKEN}</accesstoken>
            </GetProductJSON>
          </soap:Body>
        </soap:Envelope>`
    });

    const xmlData = await response.text();
    console.log('API Response:', xmlData);

    const parser = new XMLParser();
    const result = parser.parse(xmlData);
    
    const jsonResponse = JSON.parse(
      result['soap:Envelope']['soap:Body']['GetProductJSONResponse']['GetProductJSONResult']
    );

    return jsonResponse.map((item: any) => ({
      title: item.title || 'Unknown Product',
      price: item.price || 'N/A',
      currency: item.currency || 'USD',
      url: item.url || '#'
    }));
  } catch (error) {
    console.error('Error fetching product details:', error);
    throw error;
  }
}