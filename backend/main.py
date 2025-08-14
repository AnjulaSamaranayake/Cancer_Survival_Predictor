from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from pathlib import Path
import numpy as np
import joblib
import pickle

app = FastAPI(title="Survival & Mortality Predictor", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

FEATURE_COLS = [
    "Tumor_Size",
    "T_Stage",
    "N_Stage",
    "6th_Stage",
    "Differentiated",
    "Grade",
    "A_Stage",
    "Progesterone_Status",
    "Estrogen_Status",
    "Regional_Node_Examined",
    "Reginol_Node_Positive",
]

MODEL_DIR =  Path(__file__).parent / "model"
CLF_PATH = MODEL_DIR / "breast_cancer_model.pkl"
REG_PATH = MODEL_DIR / "xgboost_survival_model.joblib"

def load_any(path:Path):
    try:
        return joblib.load(path)
    except Exception:
        with open(path, "rb") as f:
            return pickle.load(f)
        
if not CLF_PATH.exists():
    raise RuntimeError(f"Classifier not found at {CLF_PATH}")
if not REG_PATH.exists():
    raise RuntimeError(f"Regressor not found at {REG_PATH}")    

clf_model = load_any(CLF_PATH)  # expects 0=dead, 1=alive
reg_model = load_any(REG_PATH)  # predicts survival months

