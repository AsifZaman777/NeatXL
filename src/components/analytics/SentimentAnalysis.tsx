'use client';

import React, { useState, useMemo } from 'react';
import { CSVData } from '../../types/types';

interface SentimentAnalysisProps {
  data: CSVData;
}

interface SentimentScore {
  text: string;
  score: number;
  sentiment: 'positive' | 'negative' | 'neutral';
  confidence: number;
  emotions: {
    joy: number;
    anger: number;
    fear: number;
    sadness: number;
    surprise: number;
  };
}

export default function SentimentAnalysis({ data }: SentimentAnalysisProps) {
  const [selectedTextColumn, setSelectedTextColumn] = useState<string>('');
  const [batchSize, setBatchSize] = useState<number>(100);

  // Detect text columns
  const textColumns = useMemo(() => {
    return data.headers.filter((header, index) => {
      const column = data.data.map(row => row[index]);
      const textValues = column.filter(val => val && typeof val === 'string' && val.length > 10);
      return textValues.length > column.length * 0.5;
    });
  }, [data]);

  // Simple sentiment analysis using keyword-based approach
  const sentimentResults = useMemo((): SentimentScore[] => {
    if (!selectedTextColumn) return [];

    const textIndex = data.headers.indexOf(selectedTextColumn);
    const texts = data.data
      .map(row => row[textIndex])
      .filter(text => text && typeof text === 'string' && text.length > 5)
      .slice(0, batchSize);

    // Simple sentiment lexicon
    const positiveWords = [
      'good', 'great', 'excellent', 'amazing', 'wonderful', 'fantastic', 'awesome', 'love', 'like',
      'happy', 'pleased', 'satisfied', 'perfect', 'best', 'brilliant', 'outstanding', 'superb',
      'delighted', 'thrilled', 'excited', 'enjoy', 'recommend', 'positive', 'success', 'win'
    ];

    const negativeWords = [
      'bad', 'terrible', 'awful', 'horrible', 'hate', 'dislike', 'disappointed', 'frustrated',
      'angry', 'sad', 'upset', 'annoyed', 'worst', 'fail', 'failed', 'problem', 'issue',
      'complain', 'complaint', 'negative', 'poor', 'difficulty', 'trouble', 'concern', 'worry'
    ];

    const emotionKeywords = {
      joy: ['happy', 'joy', 'excited', 'thrilled', 'delighted', 'cheerful', 'elated'],
      anger: ['angry', 'mad', 'furious', 'irritated', 'annoyed', 'outraged', 'rage'],
      fear: ['scared', 'afraid', 'fearful', 'worried', 'anxious', 'nervous', 'concerned'],
      sadness: ['sad', 'depressed', 'disappointed', 'upset', 'hurt', 'heartbroken', 'grief'],
      surprise: ['surprised', 'shocked', 'amazed', 'astonished', 'stunned', 'unexpected']
    };

    return texts.map(text => {
      const words = text.toLowerCase().split(/\W+/);
      
      let positiveCount = 0;
      let negativeCount = 0;
      
      const emotions = {
        joy: 0,
        anger: 0,
        fear: 0,
        sadness: 0,
        surprise: 0
      };

      words.forEach(word => {
        if (positiveWords.includes(word)) positiveCount++;
        if (negativeWords.includes(word)) negativeCount++;
        
        Object.entries(emotionKeywords).forEach(([emotion, keywords]) => {
          if (keywords.includes(word)) {
            emotions[emotion as keyof typeof emotions]++;
          }
        });
      });

      const totalSentimentWords = positiveCount + negativeCount;
      let score = 0;
      let sentiment: 'positive' | 'negative' | 'neutral' = 'neutral';
      let confidence = 0;

      if (totalSentimentWords > 0) {
        score = (positiveCount - negativeCount) / totalSentimentWords;
        confidence = Math.min(totalSentimentWords / words.length * 5, 1); // Scale confidence
        
        if (score > 0.2) sentiment = 'positive';
        else if (score < -0.2) sentiment = 'negative';
        else sentiment = 'neutral';
      }

      // Normalize emotions
      const totalEmotions = Object.values(emotions).reduce((sum, val) => sum + val, 0);
      if (totalEmotions > 0) {
        Object.keys(emotions).forEach(key => {
          emotions[key as keyof typeof emotions] = emotions[key as keyof typeof emotions] / totalEmotions;
        });
      }

      return {
        text: text.substring(0, 100) + (text.length > 100 ? '...' : ''),
        score,
        sentiment,
        confidence,
        emotions
      };
    });
  }, [data, selectedTextColumn, batchSize]);

  // Aggregate statistics
  const sentimentStats = useMemo(() => {
    if (sentimentResults.length === 0) return null;

    const positive = sentimentResults.filter(r => r.sentiment === 'positive').length;
    const negative = sentimentResults.filter(r => r.sentiment === 'negative').length;
    const neutral = sentimentResults.filter(r => r.sentiment === 'neutral').length;
    
    const avgScore = sentimentResults.reduce((sum, r) => sum + r.score, 0) / sentimentResults.length;
    const avgConfidence = sentimentResults.reduce((sum, r) => sum + r.confidence, 0) / sentimentResults.length;

    // Most common emotions
    const totalEmotions = {
      joy: sentimentResults.reduce((sum, r) => sum + r.emotions.joy, 0),
      anger: sentimentResults.reduce((sum, r) => sum + r.emotions.anger, 0),
      fear: sentimentResults.reduce((sum, r) => sum + r.emotions.fear, 0),
      sadness: sentimentResults.reduce((sum, r) => sum + r.emotions.sadness, 0),
      surprise: sentimentResults.reduce((sum, r) => sum + r.emotions.surprise, 0)
    };

    const dominantEmotion = Object.entries(totalEmotions).reduce((max, [emotion, score]) => 
      score > max.score ? { emotion, score } : max, { emotion: 'neutral', score: 0 }
    );

    return {
      total: sentimentResults.length,
      positive,
      negative,
      neutral,
      avgScore,
      avgConfidence,
      dominantEmotion,
      totalEmotions
    };
  }, [sentimentResults]);

  return (
    <div className="space-y-6">
      {/* Configuration */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg border border-pink-200 p-6">
        <h3 className="text-lg font-semibold text-pink-800 mb-4">😊 Sentiment Analysis Configuration</h3>
        
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Text Column</label>
            <select
              value={selectedTextColumn}
              onChange={(e) => setSelectedTextColumn(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            >
              <option value="">Select text column</option>
              {textColumns.map(col => (
                <option key={col} value={col}>{col}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sample Size</label>
            <input
              type="number"
              value={batchSize}
              onChange={(e) => setBatchSize(Number(e.target.value))}
              min="10"
              max="1000"
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>
        </div>
      </div>

      {/* Overall Statistics */}
      {sentimentStats && (
        <div className="bg-white rounded-lg border p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">📊 Sentiment Overview</h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-600 mb-1">Positive Sentiment</div>
              <div className="text-2xl font-bold text-green-800">
                {sentimentStats.positive} ({((sentimentStats.positive / sentimentStats.total) * 100).toFixed(1)}%)
              </div>
            </div>
            
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-red-600 mb-1">Negative Sentiment</div>
              <div className="text-2xl font-bold text-red-800">
                {sentimentStats.negative} ({((sentimentStats.negative / sentimentStats.total) * 100).toFixed(1)}%)
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="text-sm text-gray-600 mb-1">Neutral Sentiment</div>
              <div className="text-2xl font-bold text-gray-800">
                {sentimentStats.neutral} ({((sentimentStats.neutral / sentimentStats.total) * 100).toFixed(1)}%)
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-sm text-blue-600 mb-1">Average Score</div>
              <div className={`text-2xl font-bold ${
                sentimentStats.avgScore > 0.2 ? 'text-green-600' :
                sentimentStats.avgScore < -0.2 ? 'text-red-600' : 'text-gray-600'
              }`}>
                {sentimentStats.avgScore.toFixed(3)}
              </div>
            </div>
          </div>

          {/* Emotion Analysis */}
          <div className="mb-6">
            <h4 className="font-semibold text-gray-700 mb-3">🎭 Emotion Distribution</h4>
            <div className="grid grid-cols-5 gap-3">
              {Object.entries(sentimentStats.totalEmotions).map(([emotion, score]) => {
                const percentage = (score / sentimentResults.length * 100);
                const emojis = {
                  joy: '😊',
                  anger: '😠',
                  fear: '😨',
                  sadness: '😢',
                  surprise: '😮'
                };
                
                return (
                  <div key={emotion} className="text-center">
                    <div className="text-2xl mb-1">{emojis[emotion as keyof typeof emojis]}</div>
                    <div className="text-sm font-semibold text-gray-700 capitalize">{emotion}</div>
                    <div className="text-xs text-gray-600">{percentage.toFixed(1)}%</div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${Math.max(percentage, 2)}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quality Metrics */}
          <div className="grid md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
            <div>
              <div className="text-sm text-gray-600">Analysis Quality</div>
              <div className={`font-semibold ${
                sentimentStats.avgConfidence > 0.7 ? 'text-green-600' :
                sentimentStats.avgConfidence > 0.4 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {sentimentStats.avgConfidence > 0.7 ? 'High' :
                 sentimentStats.avgConfidence > 0.4 ? 'Medium' : 'Low'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Dominant Emotion</div>
              <div className="font-semibold capitalize">{sentimentStats.dominantEmotion.emotion}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Sample Size</div>
              <div className="font-semibold">{sentimentStats.total} texts</div>
            </div>
          </div>
        </div>
      )}

      {/* Detailed Results */}
      {sentimentResults.length > 0 && (
        <div className="bg-white rounded-lg border">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800">📝 Detailed Sentiment Analysis</h3>
            <p className="text-sm text-gray-600">Individual text analysis results</p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Text</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Sentiment</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Score</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Confidence</th>
                  <th className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">Top Emotion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sentimentResults.slice(0, 20).map((result, index) => {
                  const topEmotion = Object.entries(result.emotions).reduce((max, [emotion, score]) => 
                    score > max.score ? { emotion, score } : max, { emotion: 'neutral', score: 0 }
                  );
                  
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900 max-w-xs truncate">
                        {result.text}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          result.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
                          result.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {result.sentiment}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center text-sm font-semibold">
                        {result.score.toFixed(3)}
                      </td>
                      <td className="px-4 py-3 text-center text-sm">
                        {(result.confidence * 100).toFixed(0)}%
                      </td>
                      <td className="px-4 py-3 text-center text-sm capitalize">
                        {topEmotion.score > 0 ? topEmotion.emotion : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {sentimentResults.length > 20 && (
            <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600 text-center">
              Showing first 20 of {sentimentResults.length} results
            </div>
          )}
        </div>
      )}

      {/* Export Options */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        <button className="px-4 py-2 bg-pink-500 text-white rounded-lg text-sm font-medium hover:bg-pink-600 transition-colors">
          😊 Export Sentiment Report
        </button>
        <button className="px-4 py-2 bg-purple-500 text-white rounded-lg text-sm font-medium hover:bg-purple-600 transition-colors">
          📊 Download Analysis
        </button>
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors">
          🎭 Export Emotions
        </button>
      </div>
    </div>
  );
}
