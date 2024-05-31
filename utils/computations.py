import pymongo as pm
import os
import pandas as pd
from datetime import date
import json

from dotenv import load_dotenv

load_dotenv('../.env')

client = pm.MongoClient(os.getenv('MONGO_URL'))
db = client.database_name
collection = db.collection_name


def total(user_id):
        
    income = db['income']
    expenses = db['expenses']
        
    income_sheet = pd.DataFrame(list(income.find({'_id': user_id})))
    expenses = pd.DataFrame(list(income.find({'_id': user_id})))
    df['total'] = income_sheet['amount'] - expenses['amount']  
    
    
def only_expenses_from_date(user_id, _from, _to = None):
    if _to is None:
        _to = date.today()
        
    collection = db['expenses']
        
    data = pd.DataFrame(list(collection.find({'_id': user_id})))
    data['date'] = pd.to_datetime(data['data'], format='%Y-%m-%d')
    filtered_df = data.loc[(data['date'] >= _from) & (data['data'] < _to)]
    json.dumps(filtered_df.to_numpy().tolist())
    


def total_income(income, expenses):
    return sum(income) + sum(expenses)