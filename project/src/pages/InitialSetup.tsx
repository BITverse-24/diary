import React, { useState } from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useStateManager } from "../../lib/StateContext";
import { useNavigate } from 'react-router-dom';

type DatabaseType = 'initial' | 'mongodb' | 'dynamodb';

const InitialSetup = () => {
  const navigate = useNavigate();
  const { dispatch } = useStateManager()
  const [currentView, setCurrentView] = useState<DatabaseType>('initial');
  const [formData, setFormData] = useState({
      mongodbUrl: '',
      awsAccessKey: '',
      awsSecretKey: '',
      awsRegion: ''
    });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      let type = (currentView === "dynamodb") ? "aws" : "mongo";
      let config;
      if (type === 'aws') {
        config = {
          accessKeyId: formData.awsAccessKey,
          secretKey: formData.awsSecretKey,
          region: formData.awsRegion
        }
      }
      else {
        config = {
          connectionString: formData.mongodbUrl
        }
      }
      const dbConfig = {type: type, config: config}
      dispatch({ type: "DB_CONFIG", payload: dbConfig });
      console.log('Form submitted:', formData);
      navigate("/");
    };

  const handleBack = () => setCurrentView('initial');

  const DatabaseSelection = () => (
    <div className="w-full max-w-md space-y-6">
      <h1 className="text-4xl font-bold text-amber-400 text-center mb-8">Initial Setup</h1>
      
      <div className="bg-neutral-800 p-6 rounded-lg shadow-xl">
        <h2 className="text-amber-400 text-xl mb-4">Choose Your Database:</h2>
        
        <div className="space-y-3">
          <button
            onClick={() => setCurrentView('mongodb')}
            className="w-full bg-neutral-700 hover:bg-neutral-600 transition-colors p-4 rounded-lg flex items-center justify-between group"
          >
            <div>
              <div className="text-amber-400 text-left font-medium">MongoDB</div>
              <div className="text-neutral-400 text-sm">Easy Setup, Recommended</div>
            </div>
            <ArrowRight className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          <button
            onClick={() => setCurrentView('dynamodb')}
            className="w-full bg-neutral-700 hover:bg-neutral-600 transition-colors p-4 rounded-lg flex items-center justify-between group"
          >
            <div className="text-amber-400 text-left font-medium">DynamoDB</div>
            <ArrowRight className="text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        </div>
      </div>
    </div>
  );

  const MongoDBSetup = () => (
    <div className="w-full max-w-md space-y-6">
      <div className="flex items-center justify-between w-full mb-8">
        <button
          onClick={handleBack}
          className="text-amber-400 hover:text-amber-300 transition-colors p-2 rounded-full bg-neutral-800 hover:bg-neutral-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-4xl font-bold text-amber-400 text-center flex-1 mr-8">MongoDB</h1>
      </div>

      <div className="bg-neutral-800 p-6 rounded-lg shadow-xl space-y-4">
        <button className="hover:bg-neutral-600 transition-colors w-full bg-neutral-700 p-3 rounded text-amber-400 text-center">Setup Guide</button>
        <button className="hover:bg-neutral-600 transition-colors w-full bg-neutral-700 p-3 rounded text-amber-400 text-center">Guide to get connection string</button>
        
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-amber-400 mb-2">Connection String</label>
            <input 
              type="text" 
              placeholder="Value"
              value={formData.mongodbUrl}
              onChange={handleInputChange}
              className="w-full bg-neutral-700 text-amber-400 p-3 rounded border-none focus:ring-2 focus:ring-amber-400 placeholder-neutral-500"
            />
          </div>
          
          <button className="w-full bg-neutral-700 hover:bg-neutral-600 text-amber-400 p-3 rounded-lg transition-colors mt-4">
            Enter
          </button>
        </div>
      </div>
    </div>
  );

  const DynamoDBSetup = () => (
    <div className="w-full max-w-md space-y-6">
      <div className="flex items-center justify-between w-full mb-8">
        <button
          onClick={handleBack}
          className="text-amber-400 hover:text-amber-300 transition-colors p-2 rounded-full bg-neutral-800 hover:bg-neutral-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-4xl font-bold text-amber-400 text-center flex-1 mr-8">DynamoDB</h1>
      </div>

      <div className="bg-neutral-800 p-6 rounded-lg shadow-xl space-y-4">
        <button className="hover:bg-neutral-600 transition-colors w-full bg-neutral-700 p-3 rounded text-amber-400 text-center">Setup Guide</button>
        <button className="hover:bg-neutral-600 transition-colors w-full bg-neutral-700 p-3 rounded text-amber-400 text-center">Guide to get access keys</button>
        
        <div className="space-y-4 mt-6">
          <div>
            <label className="block text-amber-400 mb-2">AWS Access Key</label>
            <input 
              type="text" 
              value={formData.awsAccessKey}
              onChange={handleInputChange}
              placeholder="Value"
              className="w-full bg-neutral-700 text-amber-400 p-3 rounded border-none focus:ring-2 focus:ring-amber-400 placeholder-neutral-500"
            />
          </div>
          
          <div>
            <label className="block text-amber-400 mb-2">AWS Secret Key</label>
            <input 
              type="text" 
              value={formData.awsSecretKey}
              onChange={handleInputChange}
              placeholder="Value"
              className="w-full bg-neutral-700 text-amber-400 p-3 rounded border-none focus:ring-2 focus:ring-amber-400 placeholder-neutral-500"
            />
          </div>
          
          <div>
            <label className="block text-amber-400 mb-2">AWS Region</label>
            <input 
              type="text"
              value={formData.awsRegion}
              onChange={handleInputChange}
              placeholder="Value"
              className="w-full bg-neutral-700 text-amber-400 p-3 rounded border-none focus:ring-2 focus:ring-amber-400 placeholder-neutral-500"
            />
          </div>
          
          <button 
            className="w-full bg-neutral-700 hover:bg-neutral-600 text-amber-400 p-3 rounded-lg transition-colors mt-4"
            onClick={handleSubmit}
          >
            Enter
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      {currentView === 'initial' && <DatabaseSelection />}
      {currentView === 'mongodb' && <MongoDBSetup />}
      {currentView === 'dynamodb' && <DynamoDBSetup />}
    </div>
  );
}

export default InitialSetup;