import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useStateManager } from "../../lib/StateContext";
// import { DatabaseConfig, AwsConfig, MongoConfig } from "../../lib/StateManager";

const ConfigPage = () => {
  const navigate = useNavigate();
  const [activeDb, setActiveDb] = useState<'mongodb' | 'dynamodb'>('mongodb');
  const [formData, setFormData] = useState({
    mongodbUrl: '',
    awsAccessKey: '',
    awsSecretKey: '',
    awsRegion: ''
  });
  const { dispatch } = useStateManager()

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let type = (activeDb === "dynamodb") ? "aws" : "mongo";
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
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] flex flex-col items-center justify-start pt-8 px-4">
      {/* Back Button */}
      <div className="self-start">
        <button 
          className="p-2 rounded-full bg-[#2a2a2a] hover:bg-[#333333] transition-colors"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-5 h-5 text-amber-400" />
        </button>
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-amber-400 mb-12 mt-4 font-inconsolata">Settings</h1>

      {/* Main Card */}
      <div className="w-full max-w-md bg-[#2a2a2a]/50 backdrop-blur-sm rounded-2xl p-6 shadow-xl border border-[#333333]">
        {/* Database Toggle */}
        <div className="flex bg-[#1a1a1a] p-1 rounded-lg mb-8">
          <button
            className={`flex-1 py-2 rounded-md transition-all duration-200 ${
              activeDb === 'mongodb'
                ? 'bg-amber-400 text-[#1a1a1a]'
                : 'text-amber-400/60 hover:text-amber-400'
            }`}
            onClick={() => setActiveDb('mongodb')}
          >
            MongoDB
          </button>
          <button
            className={`flex-1 py-2 rounded-md transition-all duration-200 ${
              activeDb === 'dynamodb'
                ? 'bg-amber-400 text-[#1a1a1a]'
                : 'text-amber-400/60 hover:text-amber-400'
            }`}
            onClick={() => setActiveDb('dynamodb')}
          >
            DynamoDB
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {activeDb === 'mongodb' ? (
          <>
            <div>
              <label className="block text-sm font-medium text-amber-400/80 mb-2">
                Connection String
              </label>
              <input
                type="text"
                name="mongodbUrl"
                value={formData.mongodbUrl}
                onChange={handleInputChange}
                className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-amber-400 placeholder-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                placeholder="mongodb://username:password@host:port/database"
              />
            </div>
            <div className="bg-neutral-800 p-6 rounded-lg shadow-xl space-y-4">
              <button className="hover:bg-neutral-600 transition-colors w-full bg-neutral-700 p-3 rounded text-amber-400 text-center">Guide to get connection string</button>
            </div>
          </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-amber-400/80 mb-2">
                  AWS Access Key
                </label>
                <input
                  type="text"
                  name="awsAccessKey"
                  value={formData.awsAccessKey}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-amber-400 placeholder-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                  placeholder="Enter AWS Access Key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-400/80 mb-2">
                  AWS Secret Key
                </label>
                <input
                  type="password"
                  name="awsSecretKey"
                  value={formData.awsSecretKey}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-amber-400 placeholder-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                  placeholder="Enter AWS Secret Key"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-amber-400/80 mb-2">
                  AWS Region
                </label>
                <input
                  type="text"
                  name="awsRegion"
                  value={formData.awsRegion}
                  onChange={handleInputChange}
                  className="w-full bg-[#1a1a1a] border border-[#333333] rounded-lg px-4 py-3 text-amber-400 placeholder-amber-400/30 focus:outline-none focus:ring-2 focus:ring-amber-400/50 focus:border-transparent transition-all"
                  placeholder="e.g., us-east-1"
                />
              </div>
              <div className="bg-neutral-800 p-6 rounded-lg shadow-xl space-y-4">
                <button className="hover:bg-neutral-600 transition-colors w-full bg-neutral-700 p-3 rounded text-amber-400 text-center">Guide to get access keys</button>
              </div>
            </>
          )}

          <button
            type="submit"
            className="w-full bg-amber-400 text-[#1a1a1a] font-medium py-3 px-4 rounded-lg hover:bg-amber-500 transition-colors mt-8"
          >
            Use {(activeDb === 'mongodb') ? "MongoDB" : "DynamoDB"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ConfigPage;