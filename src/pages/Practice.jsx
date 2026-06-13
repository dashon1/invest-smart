import React, { useState, useEffect } from "react";
import { Portfolio } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  DollarSign, 
  Search, 
  Plus, 
  AlertCircle,
  InfoIcon,
  Zap
} from "lucide-react";

export default function Practice() {
  const [portfolio, setPortfolio] = useState([]);
  const [searchSymbol, setSearchSymbol] = useState("");
  const [selectedStock, setSelectedStock] = useState(null);
  const [tradeAmount, setTradeAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [virtualBalance] = useState(10000); // $10,000 starting balance

  useEffect(() => {
    loadPortfolio();
  }, []);

  const loadPortfolio = async () => {
    try {
      const data = await Portfolio.filter({ is_simulation: true }, '-created_date');
      setPortfolio(data);
    } catch (error) {
      console.error("Error loading portfolio:", error);
    }
  };

  // Mock stock data - in real app would use financial API
  const mockStockData = {
    "AAPL": { name: "Apple Inc.", price: 175.43, change: +2.34, changePercent: +1.35 },
    "GOOGL": { name: "Alphabet Inc.", price: 138.21, change: -1.23, changePercent: -0.88 },
    "MSFT": { name: "Microsoft Corp.", price: 378.85, change: +5.67, changePercent: +1.52 },
    "AMZN": { name: "Amazon.com Inc.", price: 143.63, change: +0.89, changePercent: +0.62 },
    "TSLA": { name: "Tesla Inc.", price: 248.50, change: -12.34, changePercent: -4.73 },
    "NVDA": { name: "NVIDIA Corp.", price: 875.28, change: +15.67, changePercent: +1.82 }
  };

  const handleSearch = () => {
    const symbol = searchSymbol.toUpperCase();
    if (mockStockData[symbol]) {
      setSelectedStock({
        symbol,
        ...mockStockData[symbol]
      });
    } else {
      setSelectedStock(null);
    }
  };

  const handleTrade = async (action) => {
    if (!selectedStock || !tradeAmount) return;

    const shares = parseFloat(tradeAmount);
    if (shares <= 0) return;

    setIsLoading(true);
    try {
      const existingHolding = portfolio.find(p => p.stock_symbol === selectedStock.symbol);
      
      if (action === 'buy') {
        if (existingHolding) {
          const newShares = existingHolding.shares + shares;
          const newAvgPrice = ((existingHolding.shares * existingHolding.purchase_price) + 
                              (shares * selectedStock.price)) / newShares;
          
          await Portfolio.update(existingHolding.id, {
            shares: newShares,
            purchase_price: newAvgPrice,
            current_price: selectedStock.price
          });
        } else {
          await Portfolio.create({
            stock_symbol: selectedStock.symbol,
            company_name: selectedStock.name,
            shares: shares,
            purchase_price: selectedStock.price,
            current_price: selectedStock.price,
            is_simulation: true
          });
        }
      } else if (action === 'sell' && existingHolding) {
        if (existingHolding.shares > shares) {
          await Portfolio.update(existingHolding.id, {
            shares: existingHolding.shares - shares,
            current_price: selectedStock.price
          });
        } else {
          await Portfolio.delete(existingHolding.id);
        }
      }

      await loadPortfolio();
      setTradeAmount("");
    } catch (error) {
      console.error("Error executing trade:", error);
    }
    setIsLoading(false);
  };

  const calculatePortfolioValue = () => {
    return portfolio.reduce((total, holding) => {
      const currentPrice = mockStockData[holding.stock_symbol]?.price || holding.current_price;
      return total + (currentPrice * holding.shares);
    }, 0);
  };

  const calculatePortfolioGain = () => {
    return portfolio.reduce((total, holding) => {
      const currentPrice = mockStockData[holding.stock_symbol]?.price || holding.current_price;
      const currentValue = currentPrice * holding.shares;
      const purchaseValue = holding.purchase_price * holding.shares;
      return total + (currentValue - purchaseValue);
    }, 0);
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            🎯 Practice Trading
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Practice trading with virtual money! Learn how to buy and sell stocks without any risk.
          </p>
        </div>

        {/* Virtual Balance Card */}
        <Card className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-6 h-6" />
              Virtual Trading Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-green-100 text-sm">Starting Balance</p>
                <p className="text-2xl font-bold">${virtualBalance.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-green-100 text-sm">Portfolio Value</p>
                <p className="text-2xl font-bold">${calculatePortfolioValue().toFixed(2)}</p>
              </div>
              <div>
                <p className="text-green-100 text-sm">Total Gain/Loss</p>
                <p className={`text-2xl font-bold ${calculatePortfolioGain() >= 0 ? 'text-green-200' : 'text-red-200'}`}>
                  ${calculatePortfolioGain().toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Trading Interface */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stock Search */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5 text-blue-500" />
                  Find Stocks to Trade
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    placeholder="Enter stock symbol (e.g., AAPL, GOOGL, MSFT)"
                    value={searchSymbol}
                    onChange={(e) => setSearchSymbol(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="flex-1"
                  />
                  <Button onClick={handleSearch}>
                    <Search className="w-4 h-4" />
                  </Button>
                </div>

                {/* Popular Stocks */}
                <div>
                  <h4 className="font-medium text-slate-900 mb-3">Popular Stocks</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(mockStockData).map(([symbol, data]) => (
                      <Button
                        key={symbol}
                        variant="outline"
                        onClick={() => {
                          setSearchSymbol(symbol);
                          setSelectedStock({ symbol, ...data });
                        }}
                        className="flex flex-col p-3 h-auto"
                      >
                        <span className="font-bold">{symbol}</span>
                        <span className="text-xs text-slate-500">${data.price}</span>
                        <Badge variant={data.change >= 0 ? "default" : "destructive"} className="text-xs mt-1">
                          {data.change >= 0 ? '+' : ''}{data.changePercent.toFixed(2)}%
                        </Badge>
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Stock & Trading */}
            {selectedStock && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{selectedStock.symbol} - {selectedStock.name}</span>
                    <Badge variant={selectedStock.change >= 0 ? "default" : "destructive"}>
                      {selectedStock.change >= 0 ? '+' : ''}${selectedStock.change.toFixed(2)} 
                      ({selectedStock.change >= 0 ? '+' : ''}{selectedStock.changePercent.toFixed(2)}%)
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-3xl font-bold text-slate-900">
                    ${selectedStock.price.toFixed(2)}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-slate-700 mb-2 block">
                        Number of Shares
                      </label>
                      <Input
                        type="number"
                        placeholder="0"
                        value={tradeAmount}
                        onChange={(e) => setTradeAmount(e.target.value)}
                        min="0"
                        step="0.01"
                      />
                      {tradeAmount && (
                        <p className="text-sm text-slate-500 mt-1">
                          Total: ${(parseFloat(tradeAmount) * selectedStock.price).toFixed(2)}
                        </p>
                      )}
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Button
                        onClick={() => handleTrade('buy')}
                        disabled={!tradeAmount || isLoading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Buy Shares
                      </Button>
                      <Button
                        onClick={() => handleTrade('sell')}
                        disabled={!tradeAmount || isLoading}
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                      >
                        Sell Shares
                      </Button>
                    </div>
                  </div>

                  <Alert>
                    <InfoIcon className="h-4 w-4" />
                    <AlertDescription>
                      💡 This is practice trading with virtual money. No real money is involved!
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Portfolio */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-500" />
                  Your Portfolio
                </CardTitle>
              </CardHeader>
              <CardContent>
                {portfolio.length > 0 ? (
                  <div className="space-y-3">
                    {portfolio.map((holding, index) => {
                      const currentData = mockStockData[holding.stock_symbol];
                      const currentPrice = currentData?.price || holding.current_price;
                      const currentValue = currentPrice * holding.shares;
                      const purchaseValue = holding.purchase_price * holding.shares;
                      const gain = currentValue - purchaseValue;
                      const gainPercentage = ((gain / purchaseValue) * 100).toFixed(2);

                      return (
                        <div key={index} className="p-3 border border-slate-200 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="font-medium text-slate-900">{holding.stock_symbol}</h4>
                              <p className="text-sm text-slate-500">{holding.shares} shares</p>
                            </div>
                            <Badge variant={currentData?.change >= 0 ? "default" : "destructive"} className="text-xs">
                              {currentData ? `${currentData.change >= 0 ? '+' : ''}${currentData.changePercent.toFixed(2)}%` : 'No data'}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-sm">
                            <div className="flex justify-between">
                              <span className="text-slate-500">Current Price:</span>
                              <span>${currentPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Total Value:</span>
                              <span className="font-medium">${currentValue.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-500">Gain/Loss:</span>
                              <span className={gain >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {gain >= 0 ? '+' : ''}${gain.toFixed(2)} ({gainPercentage}%)
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <TrendingUp className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="font-medium text-slate-900 mb-2">Start Trading</h3>
                    <p className="text-slate-500 text-sm">
                      Search for stocks above to make your first practice trade!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}