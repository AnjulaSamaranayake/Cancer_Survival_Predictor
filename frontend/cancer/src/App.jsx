import React, { useState } from 'react';
import './App.css';

function App() {

    //Form state
    const [formData, setFormData] = useState({
        Age: '',
        Tumor_Size: '',
        T_Stage: 'T1',
        N_Stage: 'N1',
        sixth_Stage: 'IIA',
        Differentiated: 'Poorly differentiated',
        Grade: '',
        A_Stage: 'Regional',
        Progesterone_Status: 'Negative',
        Estrogen_Status: 'Negative',
        Regional_Node_Examined: '',
        Reginol_Node_Positive: ''
    });

    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
        [name]: value
        }));
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:8000/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setPrediction(data.prediction);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
      <div className="app-container">
      <header className="app-header">
        <h1>Breast Cancer Survival Predictor</h1>
        <p className="accuracy-info">
          Our prediction model has an 85% accuracy for mortality status 
          and a Mean Squared Error of 1036.86 for survival months prediction.
        </p>
      </header>

      <main className="app-main">
        <section className="prediction-form">
          <h2>Patient Information</h2>
          <form onSubmit={handleSubmit}>
            {/* Age */}
            <div className="form-group">
              <label>Age:</label>
              <input 
                type="number" 
                name="Age" 
                value={formData.Age}
                onChange={handleChange}
                min="1"
                max="120"
                required
              />
            </div>

            {/* Tumor Size */}
            <div className="form-group">
              <label>Tumor Size (mm):</label>
              <input 
                type="number" 
                step="0.1"
                name="Tumor_Size" 
                value={formData.Tumor_Size}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            {/* T Stage */}
            <div className="form-group">
              <label>T Stage:</label>
              <select name="T_Stage" value={formData.T_Stage} onChange={handleChange}>
                <option value="T1">T1</option>
                <option value="T2">T2</option>
                <option value="T3">T3</option>
                <option value="T4">T4</option>
              </select>
            </div>

            {/* N Stage */}
            <div className="form-group">
              <label>N Stage:</label>
              <select name="N_Stage" value={formData.N_Stage} onChange={handleChange}>
                <option value="N1">N1</option>
                <option value="N2">N2</option>
                <option value="N3">N3</option>
              </select>
            </div>

            {/* 6th Stage */}
            <div className="form-group">
              <label>6th Stage:</label>
              <select name="sixth_Stage" value={formData.sixth_Stage} onChange={handleChange}>
                <option value="IIA">IIA</option>
                <option value="IIIA">IIIA</option>
                <option value="IIIC">IIIC</option>
                <option value="IIB">IIB</option>
                <option value="IIIB">IIIB</option>
              </select>
            </div>

            {/* Differentiation */}
            <div className="form-group">
              <label>Differentiation:</label>
              <select name="Differentiated" value={formData.Differentiated} onChange={handleChange}>
                <option value="Poorly differentiated">Poorly differentiated</option>
                <option value="Moderately differentiated">Moderately differentiated</option>
                <option value="Well differentiated">Well differentiated</option>
                <option value="Undifferentiated">Undifferentiated</option>
              </select>
            </div>

            {/* Grade */}
            <div className="form-group">
              <label>Grade (1-3):</label>
              <input 
                type="number" 
                min="1" 
                max="3"
                name="Grade" 
                value={formData.Grade}
                onChange={handleChange}
                required
              />
            </div>

            {/* A Stage */}
            <div className="form-group">
              <label>A Stage:</label>
              <select name="A_Stage" value={formData.A_Stage} onChange={handleChange}>
                <option value="Regional">Regional</option>
                <option value="Distant">Distant</option>
              </select>
            </div>

            {/* Progesterone Status */}
            <div className="form-group">
              <label>Progesterone Status:</label>
              <select name="Progesterone_Status" value={formData.Progesterone_Status} onChange={handleChange}>
                <option value="Negative">Negative</option>
                <option value="Positive">Positive</option>
              </select>
            </div>

            {/* Estrogen Status */}
            <div className="form-group">
              <label>Estrogen Status:</label>
              <select name="Estrogen_Status" value={formData.Estrogen_Status} onChange={handleChange}>
                <option value="Negative">Negative</option>
                <option value="Positive">Positive</option>
              </select>
            </div>

            {/* Regional Nodes Examined */}
            <div className="form-group">
              <label>Regional Nodes Examined:</label>
              <input 
                type="number" 
                name="Regional_Node_Examined" 
                value={formData.Regional_Node_Examined}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            {/* Regional Nodes Positive */}
            <div className="form-group">
              <label>Regional Nodes Positive:</label>
              <input 
                type="number" 
                name="Reginol_Node_Positive" 
                value={formData.Reginol_Node_Positive}
                onChange={handleChange}
                min="0"
                required
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Predicting...' : 'Predict Survival'}
            </button>
          </form>
        </section>

        {error && (
          <div className="error-message">
            <p>Error: {error}</p>
          </div>
        )}

        {prediction && (
  <section className="prediction-result">
    <h2>Prediction Results</h2>
    <div className={`result-card ${prediction.status.toLowerCase()}`}>
      <div className="result-header">
        <h3>
          Mortality Status: 
          <span className="status-value">
            {prediction.status === 'Alive' ? (
              <span className="alive-text">Alive 🎉</span>
            ) : (
              <span className="dead-text">Dead 💔</span>
            )}
          </span>
        </h3>
      </div>
      
      <div className="survival-months">
        <h4>Predicted Survival Duration:</h4>
        <div className="months-display">
          {Math.round(prediction.predicted_survival_months / 12)} years and {' '}
          {Math.round(prediction.predicted_survival_months % 12)} months
          <div className="months-note">
            ({prediction.predicted_survival_months} months)
          </div>
        </div>
      </div>

      {prediction.status === 'Alive' ? (
        <div className="positive-message">
          <p>This is a positive outcome! The patient is predicted to survive.</p>
          <p>Continue with recommended treatments and regular checkups.</p>
        </div>
      ) : (
        <div className="care-message">
          <p>This suggests a more serious prognosis.</p>
          <p>Consider consulting with specialists about advanced care options.</p>
        </div>
      )}
    </div>
    
    <div className="confidence-info">
      <h3>About These Results</h3>
      <ul>
        <li>Mortality prediction accuracy: 85%</li>
        <li>Survival months prediction has ±32 months margin of error</li>
        <li>Results should be interpreted by medical professionals</li>
      </ul>
    </div>
  </section>
)}
      </main>

      <footer className="app-footer">
        <p>This tool is designed to assist healthcare professionals and should not replace clinical judgment.</p>
      </footer>
    </div>
  );  
}

export default App;