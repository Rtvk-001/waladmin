// AddProducts.js
import React, { useState } from 'react';
import { BarcodeScanner } from 'react-barcode-scanner'; // Example package for barcode scanning
import supabase from '../createClient.js';
import axios from 'axios'; // For API requests
//import '../CSS/AddProducts.css'; // Optional: for custom styling


//******************************************************* */
// enable smoother tab switching. 
// show which tab is selected (highlight or do something)
// stop recurring post requests
// make sure all form data is filled before submitting, if not, enable a red outline that is not filled that shakes (animation)
//if permission denied (in console) show alert
//****************************************************** */

const AddProducts = () => {
  const [activeTab, setActiveTab] = useState('manual');
  const [barcode, setBarcode] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productDetails, setProductDetails] = useState({});
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    product_name: '',
    product_price: '',
    energy_kcal: '',
    fat_g: '',
    saturated_fat_g: '',
    trans_fat_g: '',
    cholesterol_mg: '',
    sodium_mg: '',
    carbohydrates_g: '',
    fiber_g: '',
    sugars_g: '',
    proteins_g: '',
    salt_g: '',
    vitamin_c_mg: '',
    calcium_mg: '',
    iron_mg: '',
    potassium_mg: '',
    nutrition_score_fr: ''
  });

  // Handle switching tabs
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setError('');
    setProductDetails({});
  };

  // Handle barcode scan
  const handleBarcodeScan = async (scannedBarcode) => {
    setBarcode(scannedBarcode);
    try {
      const response = await axios.get(`https://world.openfoodfacts.org/api/v0/product/${scannedBarcode}.json`);
      const product = response.data.product;
      if (product) {
        setProductName(product.product_name || 'N/A');
        setProductPrice(product.price || 'N/A');
        setProductDetails(product.nutriments || {});
        setFormData({
          ...formData,
          product_name: product.product_name || '',
          product_price: product.price || '',
          energy_kcal: product.nutriments.energy_kcal || '',
          fat_g: product.nutriments.fat_g || '',
          saturated_fat_g: product.nutriments.saturated_fat_g || '',
          trans_fat_g: product.nutriments.trans_fat_g || '',
          cholesterol_mg: product.nutriments.cholesterol_mg || '',
          sodium_mg: product.nutriments.sodium_mg || '',
          carbohydrates_g: product.nutriments.carbohydrates_g || '',
          fiber_g: product.nutriments.fiber_g || '',
          sugars_g: product.nutriments.sugars_g || '',
          proteins_g: product.nutriments.proteins_g || '',
          salt_g: product.nutriments.salt_g || '',
          vitamin_c_mg: product.nutriments.vitamin_c_mg || '',
          calcium_mg: product.nutriments.calcium_mg || '',
          iron_mg: product.nutriments.iron_mg || '',
          potassium_mg: product.nutriments.potassium_mg || '',
          nutrition_score_fr: product.nutriments.nutrition_score_fr || ''
        });
      } else {
        setError('Product not found.');
      }
    } catch (error) {
      setError('Error fetching product details.');
    }
  };

  // Handle manual entry
  const handleManualSubmit = async (event) => {
    event.preventDefault();
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            product_name: formData.product_name,
            product_price: parseFloat(formData.product_price),
            energy_kcal: formData.energy_kcal ? parseInt(formData.energy_kcal) : null,
            fat_g: formData.fat_g ? parseFloat(formData.fat_g) : null,
            saturated_fat_g: formData.saturated_fat_g ? parseFloat(formData.saturated_fat_g) : null,
            trans_fat_g: formData.trans_fat_g ? parseFloat(formData.trans_fat_g) : null,
            cholesterol_mg: formData.cholesterol_mg ? parseFloat(formData.cholesterol_mg) : null,
            sodium_mg: formData.sodium_mg ? parseFloat(formData.sodium_mg) : null,
            carbohydrates_g: formData.carbohydrates_g ? parseFloat(formData.carbohydrates_g) : null,
            fiber_g: formData.fiber_g ? parseFloat(formData.fiber_g) : null,
            sugars_g: formData.sugars_g ? parseFloat(formData.sugars_g) : null,
            proteins_g: formData.proteins_g ? parseFloat(formData.proteins_g) : null,
            salt_g: formData.salt_g ? parseFloat(formData.salt_g) : null,
            vitamin_c_mg: formData.vitamin_c_mg ? parseFloat(formData.vitamin_c_mg) : null,
            calcium_mg: formData.calcium_mg ? parseFloat(formData.calcium_mg) : null,
            iron_mg: formData.iron_mg ? parseFloat(formData.iron_mg) : null,
            potassium_mg: formData.potassium_mg ? parseFloat(formData.potassium_mg) : null,
            nutrition_score_fr: formData.nutrition_score_fr ? parseInt(formData.nutrition_score_fr) : null
          }
        ]);

      if (error) throw error;

      alert('Product added successfully!');
      setFormData({
        product_name: '',
        product_price: '',
        energy_kcal: '',
        fat_g: '',
        saturated_fat_g: '',
        trans_fat_g: '',
        cholesterol_mg: '',
        sodium_mg: '',
        carbohydrates_g: '',
        fiber_g: '',
        sugars_g: '',
        proteins_g: '',
        salt_g: '',
        vitamin_c_mg: '',
        calcium_mg: '',
        iron_mg: '',
        potassium_mg: '',
        nutrition_score_fr: ''
      });
    } catch (error) {
      setError('Error adding product.');
    }
  };

  // Handle input changes for manual entry
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <div className="add-products">
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'manual' ? 'active' : ''}`}
          onClick={() => handleTabChange('manual')}
        >
          Manual Entry
        </button>
        <button
          className={`tab ${activeTab === 'scan' ? 'active' : ''}`}
          onClick={() => handleTabChange('scan')}
        >
          Scan Barcode
        </button>
      </div>

      {activeTab === 'manual' && (
        <form onSubmit={handleManualSubmit} className="manual-form">
          <label>
            Product Name:
            <input
              type="text"
              name="product_name"
              value={formData.product_name}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Product Price:
            <input
              type="number"
              name="product_price"
              step="0.01"
              value={formData.product_price}
              onChange={handleInputChange}
              required
            />
          </label>
          <label>
            Energy (kcal):
            <input
              type="number"
              name="energy_kcal"
              value={formData.energy_kcal}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Fat (g):
            <input
              type="number"
              name="fat_g"
              value={formData.fat_g}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Saturated Fat (g):
            <input
              type="number"
              name="saturated_fat_g"
              value={formData.saturated_fat_g}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Trans Fat (g):
            <input
              type="number"
              name="trans_fat_g"
              value={formData.trans_fat_g}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Cholesterol (mg):
            <input
              type="number"
              name="cholesterol_mg"
              value={formData.cholesterol_mg}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Sodium (mg):
            <input
              type="number"
              name="sodium_mg"
              value={formData.sodium_mg}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Carbohydrates (g):
            <input
              type="number"
              name="carbohydrates_g"
              value={formData.carbohydrates_g}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Fiber (g):
            <input
              type="number"
              name="fiber_g"
              value={formData.fiber_g}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Sugars (g):
            <input
              type="number"
              name="sugars_g"
              value={formData.sugars_g}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Proteins (g):
            <input
              type="number"
              name="proteins_g"
              value={formData.proteins_g}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Salt (g):
            <input
              type="number"
              name="salt_g"
              value={formData.salt_g}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Vitamin C (mg):
            <input
              type="number"
              name="vitamin_c_mg"
              value={formData.vitamin_c_mg}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Calcium (mg):
            <input
              type="number"
              name="calcium_mg"
              value={formData.calcium_mg}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Iron (mg):
            <input
              type="number"
              name="iron_mg"
              value={formData.iron_mg}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Potassium (mg):
            <input
              type="number"
              name="potassium_mg"
              value={formData.potassium_mg}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Nutrition Score:
            <input
              type="number"
              name="nutrition_score_fr"
              value={formData.nutrition_score_fr}
              onChange={handleInputChange}
            />
          </label>
          <button type="submit">Add Product</button>
        </form>
      )}

      {activeTab === 'scan' && (
        <div className="barcode-scanner">
          <BarcodeScanner
            onScan={handleBarcodeScan}
            onError={(error) => setError(error.message)}
          />
        </div>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default AddProducts;
