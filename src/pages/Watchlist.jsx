import React, { useState, useEffect } from "react";
import { Watchlist as WatchlistEntity } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Eye, 
  Plus, 
  Trash2, 
  Bell,
  TrendingUp,
  TrendingDown,
  Star,
  Edit
} from "lucide-react";

const mockStockData = {
  "AAPL": { name: "Apple Inc.", price: 175.43, change: +2.34, changePercent: +1.35 },
  "GOOGL": { name: "Alphabet Inc.", price: 138.21, change: -1.23, changePercent: -0.88 },
  "MSFT": { name: "Microsoft Corp.", price: 378.85, change: +5.67, changePercent: +1.52 },
  "AMZN": { name: "Amazon.com Inc.", price: 143.63, change: +0.89, changePercent: +0.62 },
  "TSLA": { name: "Tesla Inc.", price: 248.50, change: -12.34, changePercent: -4.73 },
  "NVDA": { name: "NVIDIA Corp.", price: 875.28, change: +15.67, changePercent: +1.82 },
  "META": { name: "Meta Platforms", price: 468.92, change: +8.21, changePercent: +1.78 },
  "NFLX": { name: "Netflix Inc.", price: 587.34, change: -3.45, changePercent: -0.58 }
};

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [formData, setFormData] = useState({
    stock_symbol: "",
    company_name: "",
    target_price: "",
    alert_above: true,
    notes: "",
    tags: ""
  });

  useEffect(() => {
    loadWatchlist();
  }, []);

  const loadWatchlist = async () => {
    try {
      const data = await WatchlistEntity.list('-created_date');
      setWatchlist(data);
    } catch (error) {
      console.error("Error loading watchlist:", error);
    }
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    try {
      const stockData = mockStockData[formData.stock_symbol.toUpperCase()];
      if (!stockData) {
        alert("Stock not found. Try: AAPL, GOOGL, MSFT, etc.");
        return;
      }

      await WatchlistEntity.create({
        stock_symbol: formData.stock_symbol.toUpperCase(),
        company_name: stockData.name,
        target_price: parseFloat(formData.target_price) || null,
        alert_above: formData.alert_above,
        notes: formData.notes,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : []
      });

      setFormData({
        stock_symbol: "",
        company_name: "",
        target_price: "",
        alert_above: true,
        notes: "",
        tags: ""
      });
      setShowAddDialog(false);
      await loadWatchlist();
    } catch (error) {
      console.error("Error adding to watchlist:", error);
    }
  };

  const handleRemove = async (id) => {
    try {
      await WatchlistEntity.delete(id);
      await loadWatchlist();
    } catch (error) {
      console.error("Error removing from watchlist:", error);
    }
  };

  const checkPriceAlert = (watchItem) => {
    const currentData = mockStockData[watchItem.stock_symbol];
    if (!currentData || !watchItem.target_price) return false;

    if (watchItem.alert_above) {
      return currentData.price >= watchItem.target_price;
    } else {
      return currentData.price <= watchItem.target_price;
    }
  };

  return (
    <div className="p-4 md:p-8 bg-gradient-to-br from-slate-50 to-blue-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              👁️ Stock Watchlist
            </h1>
            <p className="text-slate-600 text-lg">
              Track your favorite stocks and set price alerts
            </p>
          </div>
          <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-blue-600 to-green-500">
                <Plus className="w-4 h-4 mr-2" />
                Add to Watchlist
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Stock to Watchlist</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleAddStock} className="space-y-4">
                <div>
                  <Label>Stock Symbol</Label>
                  <Input
                    placeholder="e.g., AAPL"
                    value={formData.stock_symbol}
                    onChange={(e) => setFormData({...formData, stock_symbol: e.target.value.toUpperCase()})}
                    required
                  />
                </div>
                <div>
                  <Label>Target Price (Optional)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Set a price alert"
                    value={formData.target_price}
                    onChange={(e) => setFormData({...formData, target_price: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Alert When</Label>
                  <div className="flex gap-2 mt-2">
                    <Button
                      type="button"
                      variant={formData.alert_above ? "default" : "outline"}
                      onClick={() => setFormData({...formData, alert_above: true})}
                      className="flex-1"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Above Target
                    </Button>
                    <Button
                      type="button"
                      variant={!formData.alert_above ? "default" : "outline"}
                      onClick={() => setFormData({...formData, alert_above: false})}
                      className="flex-1"
                    >
                      <TrendingDown className="w-4 h-4 mr-2" />
                      Below Target
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Notes</Label>
                  <Textarea
                    placeholder="Why are you watching this stock?"
                    value={formData.notes}
                    onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  />
                </div>
                <div>
                  <Label>Tags (comma-separated)</Label>
                  <Input
                    placeholder="tech, growth, dividend"
                    value={formData.tags}
                    onChange={(e) => setFormData({...formData, tags: e.target.value})}
                  />
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowAddDialog(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Add Stock</Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Watchlist Grid */}
        {watchlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {watchlist.map((item, idx) => {
              const stockData = mockStockData[item.stock_symbol];
              const priceAlertTriggered = checkPriceAlert(item);

              return (
                <Card key={idx} className={`hover:shadow-lg transition-shadow ${
                  priceAlertTriggered ? 'ring-2 ring-amber-400 bg-amber-50/30' : ''
                }`}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="flex items-center gap-2 mb-2">
                          {item.stock_symbol}
                          {priceAlertTriggered && (
                            <Bell className="w-4 h-4 text-amber-500 animate-pulse" />
                          )}
                        </CardTitle>
                        <p className="text-sm text-slate-600">{item.company_name}</p>
                      </div>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleRemove(item.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {stockData && (
                      <div>
                        <div className="text-3xl font-bold text-slate-900">
                          ${stockData.price.toFixed(2)}
                        </div>
                        <Badge variant={stockData.change >= 0 ? "default" : "destructive"} className="mt-2">
                          {stockData.change >= 0 ? '+' : ''}${stockData.change.toFixed(2)} 
                          ({stockData.change >= 0 ? '+' : ''}{stockData.changePercent.toFixed(2)}%)
                        </Badge>
                      </div>
                    )}

                    {item.target_price && (
                      <div className="p-3 bg-slate-50 rounded-lg">
                        <div className="flex items-center gap-2 text-sm text-slate-600 mb-1">
                          {item.alert_above ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          Alert {item.alert_above ? 'above' : 'below'}
                        </div>
                        <p className="text-lg font-bold text-slate-900">
                          ${item.target_price.toFixed(2)}
                        </p>
                        {priceAlertTriggered && (
                          <Badge className="mt-2 bg-amber-100 text-amber-800">
                            🔔 Price alert triggered!
                          </Badge>
                        )}
                      </div>
                    )}

                    {item.notes && (
                      <div>
                        <p className="text-sm text-slate-600 italic">"{item.notes}"</p>
                      </div>
                    )}

                    {item.tags && item.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, tagIdx) => (
                          <Badge key={tagIdx} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-16">
              <Eye className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-slate-900 mb-2">No Stocks in Watchlist</h3>
              <p className="text-slate-500 mb-6 max-w-md mx-auto">
                Start tracking stocks you're interested in. Set price alerts to get notified when they hit your target.
              </p>
              <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600">
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Stock
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}