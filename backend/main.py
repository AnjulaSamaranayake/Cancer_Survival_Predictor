from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import pickle
import numpy as np
import uvicorn
import os

#Load Models

alive_dead_model_path = os.path.join("model", "breast_cancer_model.pkl")
survival_months_model_path = os.path.join("model", "xgboost_survival_model.joblib")


with open(alive_dead_model_path, "rb") as f:
    alive_dead_model = pickle.load(f)

survival_months_model = joblib.load(survival_months_model_path)

# Category Mapping

T_STAGE_MAP = {'T1': 0, 'T2': 1, 'T3': 2, 'T4': 3}
N_STAGE_MAP = {'N1': 0, 'N2': 1, 'N3': 2}
STAGE6_MAP = {'IIA': 0, 'IIIA': 1, 'IIIC': 2, 'IIB': 3, 'IIIB': 4}
DIFF_MAP = {
    'Poorly differentiated': 0,
    'Moderately differentiated': 1,
    'Well differentiated': 2,
    'Undifferentiated': 3
}
A_STAGE_MAP = {'Regional': 0, 'Distant': 1}
ESTROGEN_MAP = {'Negative': 0, 'Positive': 1}
PROGESTERONE_MAP = {'Negative': 0, 'Positive': 1}

#Request Schema

class PatientData(BaseModel):
    Tumor_Size: float
    T_Stage: str
    N_Stage: str
    sixth_Stage: str
    Differentiated: str
    Grade: int
    A_Stage: str
    Progesterone_Status: str
    Estrogen_Status: str
    Regional_Node_Examined: int
    Reginol_Node_Positive: int

#FastAPI App
app = FastAPI()

@app.get("/")
def home():
    return {"message": "Breast Cancer Prediction API is running"}

@app.post("/predict")
def predict(data: PatientData):
    try:
        # Encode categorical fields
        encoded_features = [
            data.Tumor_Size,
            T_STAGE_MAP[data.T_Stage],
            N_STAGE_MAP[data.N_Stage],
            STAGE6_MAP[data.sixth_Stage],
            DIFF_MAP[data.Differentiated],
            data.Grade,
            A_STAGE_MAP[data.A_Stage],
            PROGESTERONE_MAP[data.Progesterone_Status],
            ESTROGEN_MAP[data.Estrogen_Status],
            data.Regional_Node_Examined,
            data.Reginol_Node_Positive
        ]

        # Convert to numpy array
        input_array = np.array(encoded_features).reshape(1, -1)

        # Predict Alive/Dead
        alive_dead_pred = alive_dead_model.predict(input_array)[0]

        # Predict Survival Months
        survival_months_pred = survival_months_model.predict(input_array)[0]

        # Prepare response
        result = {
            "status": "Alive" if alive_dead_pred == 1 else "Dead",
            "predicted_survival_months": round(float(survival_months_pred), 2)
        }

        return result
    except Exception as e:
        return {"error": str(e)}
    
#Run App

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)