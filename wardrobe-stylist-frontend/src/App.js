import { useState, useEffect } from 'react';
import { 
  Shirt, 
  Plus, 
  Trash2, 
  Edit3, 
  MessageCircle, 
  Camera, 
  Sparkles, 
  User,
  Search,
  Filter,
  Upload,
  Send,
  ShoppingBag
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:3000'; // Update this to your backend URL

const WardrobeStylistApp = () => {
  const [activeTab, setActiveTab] = useState('wardrobe');
  const [wardrobe, setWardrobe] = useState({});
  const [loading, setLoading] = useState(false);
  const [userId] = useState('abc123'); // In real app, get from auth
  
  // Wardrobe states
  const [newItem, setNewItem] = useState({
    name: '',
    type: 'topwear',
    color: '',
    tags: '',
    category: 'casual'
  });
  const [editingItem, setEditingItem] = useState(null);
  const [filterType, setFilterType] = useState('all');
  
  // Chat states
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  
  // Image analysis states
  const [selectedImage, setSelectedImage] = useState(null);
  const [imageQuestion, setImageQuestion] = useState('');
  const [imageAnalysisResult, setImageAnalysisResult] = useState('');
  const [imageLoading, setImageLoading] = useState(false);
  
  // Outfit suggestion states
  const [occasion, setOccasion] = useState('');
  const [outfitSuggestion, setOutfitSuggestion] = useState('');
  const [suggestionLoading, setSuggestionLoading] = useState(false);

  // Load wardrobe on component mount
  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/wardrobe/${userId}`);
      const data = await response.json();
      setWardrobe(data.wardrobe || {});
    } catch (error) {
      console.error('Failed to load wardrobe:', error);
    } finally {
      setLoading(false);
    }
  };

  const addItem = async () => {
    if (!newItem.name) return;
    
    try {
      setLoading(true);
      const itemId = `item-${Date.now()}`;
      const itemData = {
        ...newItem,
        tags: newItem.tags ? newItem.tags.split(',').map(tag => tag.trim()) : []
      };
      
      const response = await fetch(`${API_BASE_URL}/wardrobe/${userId}/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, item: itemData })
      });
      
      if (response.ok) {
        await loadWardrobe();
        setNewItem({ name: '', type: 'topwear', color: '', tags: '', category: 'casual' });
      }
    } catch (error) {
      console.error('Failed to add item:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteItem = async (itemId) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/wardrobe/${userId}/removeItem/${itemId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        await loadWardrobe();
      }
    } catch (error) {
      console.error('Failed to delete item:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (itemId, updatedData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE_URL}/wardrobe/${userId}/updateItem/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updatedData,
          tags: updatedData.tags ? updatedData.tags.split(',').map(tag => tag.trim()) : []
        })
      });
      
      if (response.ok) {
        await loadWardrobe();
        setEditingItem(null);
      }
    } catch (error) {
      console.error('Failed to update item:', error);
    } finally {
      setLoading(false);
    }
  };

  const askStylist = async () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { type: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatLoading(true);
    
    try {
      const response = await fetch(`${API_BASE_URL}/stylist/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: chatInput })
      });
      
      const data = await response.json();
      const botMessage = { type: 'bot', content: data.reply };
      setChatMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Failed to get stylist response:', error);
      const errorMessage = { type: 'bot', content: 'Sorry, I encountered an error. Please try again.' };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setChatLoading(false);
      setChatInput('');
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage || !imageQuestion.trim()) return;
    
    try {
      setImageLoading(true);
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('question', imageQuestion);
      
      const response = await fetch(`${API_BASE_URL}/vision/image`, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      setImageAnalysisResult(data.response);
    } catch (error) {
      console.error('Failed to analyze image:', error);
      setImageAnalysisResult('Failed to analyze image. Please try again.');
    } finally {
      setImageLoading(false);
    }
  };

  const suggestOutfit = async () => {
    if (!occasion.trim()) return;
    
    try {
      setSuggestionLoading(true);
      const response = await fetch(`${API_BASE_URL}/suggest-outfit/${userId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ occasion })
      });
      
      const data = await response.json();
      setOutfitSuggestion(data.suggestion);
    } catch (error) {
      console.error('Failed to get outfit suggestion:', error);
      setOutfitSuggestion('Failed to get outfit suggestion. Please try again.');
    } finally {
      setSuggestionLoading(false);
    }
  };

  const filteredWardrobe = Object.entries(wardrobe).filter(([id, item]) => 
    filterType === 'all' || item.type === filterType
  );

  const getItemIcon = (type) => {
    switch (type) {
      case 'topwear': return <Shirt className="w-6 h-6" />;
      case 'bottomwear': return <div className="w-6 h-6 bg-gray-400 rounded-sm" />;
      case 'footwear': return <div className="w-6 h-6 bg-gray-600 rounded-full" />;
      case 'accessories': return <div className="w-6 h-6 border-2 border-gray-400 rounded-full" />;
      default: return <Shirt className="w-6 h-6" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-3">
            <Sparkles className="w-8 h-8 text-purple-600" />
            AI Wardrobe Stylist
          </h1>
          <p className="text-gray-600">Manage your wardrobe and get personalized style advice</p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { id: 'wardrobe', label: 'My Wardrobe', icon: ShoppingBag },
            { id: 'chat', label: 'Style Chat', icon: MessageCircle },
            { id: 'suggest', label: 'Outfit Ideas', icon: Sparkles },
            { id: 'vision', label: 'Image Analysis', icon: Camera }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-purple-50 hover:text-purple-600 shadow-md'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Wardrobe Tab */}
        {activeTab === 'wardrobe' && (
          <div className="space-y-8">
            {/* Add New Item */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <Plus className="w-6 h-6 text-purple-600" />
                Add New Item
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <input
                  type="text"
                  placeholder="Item name"
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({...newItem, type: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="topwear">Topwear</option>
                  <option value="bottomwear">Bottomwear</option>
                  <option value="footwear">Footwear</option>
                  <option value="accessories">Accessories</option>
                </select>
                <input
                  type="text"
                  placeholder="Color"
                  value={newItem.color}
                  onChange={(e) => setNewItem({...newItem, color: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="casual">Casual</option>
                  <option value="formal">Formal</option>
                  <option value="partywear">Party</option>
                  <option value="outdoor">Outdoor</option>
                </select>
                <input
                  type="text"
                  placeholder="Tags (comma separated)"
                  value={newItem.tags}
                  onChange={(e) => setNewItem({...newItem, tags: e.target.value})}
                  className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={addItem}
                  disabled={loading || !newItem.name}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" />
                  Add Item
                </button>
              </div>
            </div>

            {/* Filter */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center gap-4 mb-4">
                <Filter className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Filter by type:</span>
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                >
                  <option value="all">All Items</option>
                  <option value="topwear">Topwear</option>
                  <option value="bottomwear">Bottomwear</option>
                  <option value="footwear">Footwear</option>
                  <option value="accessories">Accessories</option>
                </select>
              </div>

              {/* Wardrobe Items */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredWardrobe.map(([id, item]) => (
                  <div key={id} className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100 hover:shadow-lg transition-all">
                    {editingItem === id ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={item.name}
                          onChange={(e) => setWardrobe({...wardrobe, [id]: {...item, name: e.target.value}})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <select
                          value={item.type}
                          onChange={(e) => setWardrobe({...wardrobe, [id]: {...item, type: e.target.value}})}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        >
                          <option value="topwear">Topwear</option>
                          <option value="bottomwear">Bottomwear</option>
                          <option value="footwear">Footwear</option>
                          <option value="accessories">Accessories</option>
                        </select>
                        <input
                          type="text"
                          value={item.color || ''}
                          onChange={(e) => setWardrobe({...wardrobe, [id]: {...item, color: e.target.value}})}
                          placeholder="Color"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => updateItem(id, item)}
                            className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm hover:bg-green-600"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingItem(null)}
                            className="flex-1 bg-gray-500 text-white py-2 rounded-lg text-sm hover:bg-gray-600"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            {getItemIcon(item.type)}
                            <div>
                              <h3 className="font-semibold text-gray-800">{item.name}</h3>
                              <p className="text-sm text-gray-600 capitalize">{item.type}</p>
                            </div>
                          </div>
                          <div className="flex gap-1">
                            <button
                              onClick={() => setEditingItem(id)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteItem(id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {item.color && (
                          <p className="text-sm text-gray-600 mb-2">Color: {item.color}</p>
                        )}
                        {item.category && (
                          <p className="text-sm text-gray-600 mb-2 capitalize">Category: {item.category}</p>
                        )}
                        {item.tags && item.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {item.tags.map((tag, idx) => (
                              <span key={idx} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {filteredWardrobe.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <Shirt className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <p>No items found. Add some items to your wardrobe!</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 h-96 flex flex-col">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-purple-600" />
              Chat with AI Stylist
            </h2>
            
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
              {chatMessages.length === 0 && (
                <div className="text-center text-gray-500 py-8">
                  <MessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Start a conversation with your AI stylist!</p>
                  <p className="text-sm mt-2">Ask questions about your wardrobe, styling tips, or outfit recommendations.</p>
                </div>
              )}
              
              {chatMessages.map((message, idx) => (
                <div key={idx} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.type === 'user' 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-gray-100 text-gray-800'
                  }`}>
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  </div>
                </div>
              ))}
              
              {chatLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="animate-spin w-4 h-4 border-2 border-purple-600 border-t-transparent rounded-full"></div>
                      Thinking...
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && askStylist()}
                placeholder="Ask your stylist anything..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <button
                onClick={askStylist}
                disabled={chatLoading || !chatInput.trim()}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}

        {/* Outfit Suggestion Tab */}
        {activeTab === 'suggest' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-600" />
              Get Outfit Suggestions
            </h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  placeholder="What's the occasion? (e.g., casual day out, business meeting, dinner date)"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={suggestOutfit}
                  disabled={suggestionLoading || !occasion.trim()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {suggestionLoading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Sparkles className="w-5 h-5" />
                  )}
                  Suggest
                </button>
              </div>
              
              {outfitSuggestion && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="font-semibold text-gray-800 mb-3">Outfit Suggestion:</h3>
                  <div className="text-gray-700 whitespace-pre-wrap">{outfitSuggestion}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Vision/Image Analysis Tab */}
        {activeTab === 'vision' && (
          <div className="bg-white rounded-2xl shadow-xl p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
              <Camera className="w-6 h-6 text-purple-600" />
              Image Analysis
            </h2>
            
            <div className="space-y-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">Click to upload an image</p>
                  {selectedImage && (
                    <p className="text-purple-600 mt-2">Selected: {selectedImage.name}</p>
                  )}
                </label>
              </div>
              
              <div className="flex gap-4">
                <input
                  type="text"
                  value={imageQuestion}
                  onChange={(e) => setImageQuestion(e.target.value)}
                  placeholder="What would you like to know about this image?"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  onClick={analyzeImage}
                  disabled={imageLoading || !selectedImage || !imageQuestion.trim()}
                  className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {imageLoading ? (
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                  Analyze
                </button>
              </div>
              
              {imageAnalysisResult && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
                  <h3 className="font-semibold text-gray-800 mb-3">Analysis Result:</h3>
                  <div className="text-gray-700 whitespace-pre-wrap">{imageAnalysisResult}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WardrobeStylistApp;
