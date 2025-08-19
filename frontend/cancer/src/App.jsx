import React, { useState } from 'react';
import './App.css';

function App() {
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
            setPrediction(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="app-container">
            <header className="app-header">
                <div className="header-content">
                    <h1>SurviCan Predictor</h1>
                    <p className="subtitle">
                        <i>An AI-powered tool that predicts breast cancer survival chances using key medical details, offering guidance with clarity and hope.</i>
                    </p>
                </div>
                <div className="accuracy-badge">
                    <span>85% Accuracy</span>
                </div>
            </header>

            <main className="app-main">
                <section className="form-section">
                    <div className="form-card">
                      <div className='form-description'>
                        <h3>About This Form</h3>
                        <p>
                           <b><i>This form collects details about your breast cancer diagnosis, including tumour size (T stage), 
                                spread to lymph nodes (N stage), and BI-RADS imaging results. It also considers how cancer cells 
                                differ from normal ones (differentiation and grade), overall stage (regional or distant spread), 
                                and tumour size in millimeters. Hormone receptor status (estrogen and progesterone) helps guide 
                                treatment options. Finally, information about lymph nodes examined and those positive for cancer 
                                is included to better understand disease progression.</i></b>
                        </p>
                      </div>
                      <div className='model-disclaimer'>
                        <i className='icon-info-circle'></i>
                        <p>
                          <strong>Note:</strong> Our prediction models are continuously improved and updated 
                                    to provide the most accurate results. While current accuracy stands at 85%, 
                                    we regularly incorporate new research and clinical data to enhance predictions.
                        </p>
                      </div>
                        <h2 className="form-title">
                            <i className="icon-patient"></i> Patient Information
                        </h2>
                        <form onSubmit={handleSubmit}>
                            <div className="form-grid">
                                {/* Demographic Info */}
                                <div className="form-group">
                                    <label>Age</label>
                                    <input
                                        type="number"
                                        name="Age"
                                        value={formData.Age}
                                        onChange={handleChange}
                                        min="1"
                                        max="120"
                                        required
                                        className="form-input"
                                    />
                                </div>

                                {/* Tumor Characteristics */}
                                <div className="form-group">
                                    <label>Tumor Size (mm)</label>
                                    <input
                                        type="number"
                                        step="0.1"
                                        name="Tumor_Size"
                                        value={formData.Tumor_Size}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>T Stage</label>
                                    <select
                                        name="T_Stage"
                                        value={formData.T_Stage}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="T1">T1</option>
                                        <option value="T2">T2</option>
                                        <option value="T3">T3</option>
                                        <option value="T4">T4</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>N Stage</label>
                                    <select
                                        name="N_Stage"
                                        value={formData.N_Stage}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="N1">N1</option>
                                        <option value="N2">N2</option>
                                        <option value="N3">N3</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>6th Stage</label>
                                    <select
                                        name="sixth_Stage"
                                        value={formData.sixth_Stage}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="IIA">IIA</option>
                                        <option value="IIIA">IIIA</option>
                                        <option value="IIIC">IIIC</option>
                                        <option value="IIB">IIB</option>
                                        <option value="IIIB">IIIB</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Differentiation</label>
                                    <select
                                        name="Differentiated"
                                        value={formData.Differentiated}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="Poorly differentiated">Poorly differentiated</option>
                                        <option value="Moderately differentiated">Moderately differentiated</option>
                                        <option value="Well differentiated">Well differentiated</option>
                                        <option value="Undifferentiated">Undifferentiated</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Grade (1-3)</label>
                                    <input
                                        type="number"
                                        min="1"
                                        max="3"
                                        name="Grade"
                                        value={formData.Grade}
                                        onChange={handleChange}
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>A Stage</label>
                                    <select
                                        name="A_Stage"
                                        value={formData.A_Stage}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="Regional">Regional</option>
                                        <option value="Distant">Distant</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Progesterone Status</label>
                                    <select
                                        name="Progesterone_Status"
                                        value={formData.Progesterone_Status}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="Negative">Negative</option>
                                        <option value="Positive">Positive</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Estrogen Status</label>
                                    <select
                                        name="Estrogen_Status"
                                        value={formData.Estrogen_Status}
                                        onChange={handleChange}
                                        className="form-select"
                                    >
                                        <option value="Negative">Negative</option>
                                        <option value="Positive">Positive</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Regional Nodes Examined</label>
                                    <input
                                        type="number"
                                        name="Regional_Node_Examined"
                                        value={formData.Regional_Node_Examined}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                        className="form-input"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>Regional Nodes Positive</label>
                                    <input
                                        type="number"
                                        name="Reginol_Node_Positive"
                                        value={formData.Reginol_Node_Positive}
                                        onChange={handleChange}
                                        min="0"
                                        required
                                        className="form-input"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="submit-button"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Processing...
                                    </>
                                ) : (
                                    'Predict Survival'
                                )}
                            </button>
                        </form>
                    </div>
                </section>

                {error && (
                    <div className="error-card">
                        <div className="error-icon">!</div>
                        <div className="error-content">
                            <h3>Error</h3>
                            <p>{error}</p>
                        </div>
                    </div>
                )}

                {prediction && (
                    <section className="results-section">
                        <div className={`result-card ${prediction.status.toLowerCase()}`}>
                            <div className="result-header">
                                <h2>Prediction Results</h2>
                                <div className="status-badge">
                                    {prediction.status === 'Alive' ? 'Alive' : 'Deceased'}
                                </div>
                            </div>

                            <div className="result-content">
                                <div className="survival-months">
                                    <h3>Predicted Survival Duration</h3>
                                    <div className="duration-display">
                                        <span className="years">
                                            {Math.round(prediction.predicted_survival_months / 12)}
                                        </span>
                                        <span className="time-unit">years</span>
                                        <span className="months">
                                            {Math.round(prediction.predicted_survival_months % 12)}
                                        </span>
                                        <span className="time-unit">months</span>
                                    </div>
                                    <div className="months-note">
                                        ({prediction.predicted_survival_months.toFixed(1)} months)
                                    </div>
                                </div>

                                <div className="result-message">
                                    {prediction.status === 'Alive' ? (
                                        <>
                                            <p className="positive">
                                                <i className="icon-check"></i> Positive prognosis detected
                                            </p>
                                            <p>Continue with recommended treatments and regular monitoring.</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="serious">
                                                <i className="icon-warning"></i> Serious prognosis detected
                                            </p>
                                            <p>Consider specialist consultation for advanced care options.</p>
                                        </>
                                    )}
                                </div>
                            </div>

                            <div className="confidence-info">
                                <h3>About These Results</h3>
                                <ul>
                                    <li>Mortality prediction accuracy: 85%</li>
                                    <li>Survival months prediction has ±32 months margin of error</li>
                                    <li>Results should be interpreted by medical professionals</li>
                                    <li className="model-update-note">
                                        <i className="icon-update"></i>
                                        Models updated quarterly with latest clinical data
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </section>
                )}
            </main>

            <footer className="app-footer">
                <p>
                    <i className="icon-medical"></i> This tool is designed to assist healthcare professionals 
                    and should not replace clinical judgment.
                </p>
                <p className="copyright">© {new Date().getFullYear()} SurviCan Predictor</p>
                <p className='copyright'>Created by ANJU.</p>
            </footer>
        </div>
    );
}

export default App;