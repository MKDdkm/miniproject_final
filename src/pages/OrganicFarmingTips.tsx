import { useState, useEffect } from "react";
import { 
  Leaf, 
  CheckCircle, 
  Clock, 
  Plus,
  Calendar,
  AlertTriangle,
  Trash2,
  Edit3,
  Filter,
  Bug,
  Droplets,
  Sprout,
  Recycle,
  Sun,
  Moon,
  Target
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Organic farming tips database
const organicTips = {
  pestControl: {
    title: "Natural Pest Control",
    icon: Bug,
    tips: [
      {
        name: "Neem Oil Spray",
        description: "Mix 2 tablespoons neem oil + 1 tablespoon mild soap + 1 gallon water",
        usage: "Spray on affected plants every 3-7 days",
        benefits: ["Controls aphids", "Repels whiteflies", "Prevents fungal diseases"],
        season: "Year-round",
        cost: "₹50-80 per treatment"
      },
      {
        name: "Companion Planting",
        description: "Plant marigolds, basil, and garlic around crops",
        usage: "Interplant during sowing season",
        benefits: ["Natural pest deterrent", "Improves soil health", "Attracts beneficial insects"],
        season: "Planting time",
        cost: "₹20-40 per plant"
      },
      {
        name: "Garlic-Chili Spray",
        description: "Blend 2 garlic cloves + 2 green chilies + 1 liter water, strain and spray",
        usage: "Apply early morning or evening",
        benefits: ["Repels caterpillars", "Controls thrips", "Safe for humans"],
        season: "Peak pest season",
        cost: "₹10-15 per liter"
      },
      {
        name: "Diatomaceous Earth",
        description: "Sprinkle food-grade DE around plant base",
        usage: "Apply after dew dries, before rain",
        benefits: ["Controls crawling insects", "Organic approved", "Long-lasting"],
        season: "Dry periods",
        cost: "₹200-300 per kg"
      }
    ]
  },
  fertilizers: {
    title: "Organic Fertilizers",
    icon: Recycle,
    tips: [
      {
        name: "Compost Tea",
        description: "Steep mature compost in water for 24-48 hours, strain and dilute 1:10",
        usage: "Apply every 2 weeks during growing season",
        benefits: ["Rich in nutrients", "Improves soil biology", "Enhances plant immunity"],
        season: "Growing season",
        cost: "₹5-10 per liter"
      },
      {
        name: "Banana Peel Fertilizer",
        description: "Bury chopped banana peels around plants or make liquid fertilizer",
        usage: "Monthly application around fruit trees",
        benefits: ["High potassium", "Phosphorus rich", "Improves flowering"],
        season: "Flowering and fruiting",
        cost: "Free (kitchen waste)"
      },
      {
        name: "Fish Emulsion",
        description: "Mix 1 part fish waste + 2 parts water, ferment for 2 weeks",
        usage: "Dilute 1:20 and apply biweekly",
        benefits: ["High nitrogen", "Fast-acting", "Improves soil structure"],
        season: "Vegetative growth",
        cost: "₹30-50 per liter"
      },
      {
        name: "Vermicompost",
        description: "Well-decomposed worm castings mixed with soil",
        usage: "Apply 2-4 inches around plants annually",
        benefits: ["Slow-release nutrients", "Improves water retention", "Enhances soil biology"],
        season: "Pre-planting and top-dressing",
        cost: "₹8-12 per kg"
      }
    ]
  },
  soilHealth: {
    title: "Soil Health Management",
    icon: Sprout,
    tips: [
      {
        name: "Cover Cropping",
        description: "Plant legumes like cowpea, clover during off-season",
        usage: "Sow after main crop harvest",
        benefits: ["Nitrogen fixation", "Prevents soil erosion", "Improves organic matter"],
        season: "Post-harvest",
        cost: "₹500-800 per acre"
      },
      {
        name: "Mulching",
        description: "Apply 2-4 inches of organic matter around plants",
        usage: "Refresh every 2-3 months",
        benefits: ["Retains moisture", "Suppresses weeds", "Adds organic matter"],
        season: "Year-round",
        cost: "₹200-400 per acre"
      },
      {
        name: "Crop Rotation",
        description: "Rotate between legumes, cereals, and root vegetables",
        usage: "Plan 3-4 year rotation cycle",
        benefits: ["Breaks pest cycles", "Improves soil fertility", "Reduces disease"],
        season: "Annual planning",
        cost: "Planning only"
      },
      {
        name: "Green Manuring",
        description: "Grow and incorporate green crops like sunhemp, dhaincha",
        usage: "Grow for 45-60 days then incorporate",
        benefits: ["Adds organic nitrogen", "Improves soil structure", "Increases microbial activity"],
        season: "Pre-monsoon",
        cost: "₹300-500 per acre"
      }
    ]
  },
  waterManagement: {
    title: "Water Conservation",
    icon: Droplets,
    tips: [
      {
        name: "Drip Irrigation",
        description: "Install water-efficient drip system",
        usage: "Daily controlled watering",
        benefits: ["Saves 40-50% water", "Reduces weed growth", "Prevents fungal diseases"],
        season: "Year-round",
        cost: "₹15,000-25,000 per acre"
      },
      {
        name: "Rainwater Harvesting",
        description: "Collect and store rainwater in tanks/ponds",
        usage: "Use during dry periods",
        benefits: ["Reduces dependency", "Free water source", "Improves groundwater"],
        season: "Monsoon collection",
        cost: "₹20,000-50,000 one-time"
      },
      {
        name: "Moisture Retention",
        description: "Use mulch and organic matter to retain soil moisture",
        usage: "Apply before hot season",
        benefits: ["Reduces irrigation needs", "Improves soil structure", "Saves labor"],
        season: "Summer preparation",
        cost: "₹300-500 per acre"
      }
    ]
  }
};

// Daily tasks system
const generateDailyTasks = () => [
  {
    id: 1,
    title: "Check irrigation system",
    description: "Inspect drip lines and check for blockages in field A",
    priority: "high",
    category: "irrigation",
    estimatedTime: "30 minutes",
    dueTime: "06:00 AM",
    status: "pending",
    location: "Field A - North Block",
    weather: "Good conditions for irrigation check"
  },
  {
    id: 2,
    title: "Apply neem oil spray",
    description: "Treat tomato plants for aphid prevention",
    priority: "medium",
    category: "pest-control",
    estimatedTime: "45 minutes",
    dueTime: "07:00 AM",
    status: "pending",
    location: "Greenhouse 1",
    weather: "Ideal spraying conditions - no wind"
  },
  {
    id: 3,
    title: "Harvest ready fruits",
    description: "Collect ripe mangoes from trees 15-20",
    priority: "high",
    category: "harvesting",
    estimatedTime: "2 hours",
    dueTime: "08:00 AM",
    status: "pending",
    location: "Orchard Section B",
    weather: "Perfect harvesting weather"
  },
  {
    id: 4,
    title: "Soil moisture testing",
    description: "Check soil moisture levels in newly planted areas",
    priority: "low",
    category: "monitoring",
    estimatedTime: "20 minutes",
    dueTime: "10:00 AM",
    status: "pending",
    location: "Field C - East Block",
    weather: "Good for soil testing"
  },
  {
    id: 5,
    title: "Compost turning",
    description: "Turn compost pile and add water if needed",
    priority: "medium",
    category: "soil-health",
    estimatedTime: "25 minutes",
    dueTime: "04:00 PM",
    status: "completed",
    location: "Compost Area",
    weather: "Suitable for compost work"
  }
];

const OrganicFarmingTips = () => {
  const [selectedCategory, setSelectedCategory] = useState("pestControl");
  const [tasks, setTasks] = useState(generateDailyTasks());
  const [newTask, setNewTask] = useState("");
  const [taskFilter, setTaskFilter] = useState("all");
  const [showAddTask, setShowAddTask] = useState(false);

  const addTask = () => {
    if (newTask.trim()) {
      const task = {
        id: Date.now(),
        title: newTask,
        description: "Custom task added by user",
        priority: "medium",
        category: "custom",
        estimatedTime: "30 minutes",
        dueTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        status: "pending",
        location: "To be determined",
        weather: "Check current conditions"
      };
      setTasks([...tasks, task]);
      setNewTask("");
      setShowAddTask(false);
    }
  };

  const toggleTaskStatus = (taskId: number) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: task.status === 'pending' ? 'completed' : 'pending' }
        : task
    ));
  };

  const deleteTask = (taskId: number) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "irrigation": return <Droplets className="h-4 w-4" />;
      case "pest-control": return <Bug className="h-4 w-4" />;
      case "harvesting": return <Sprout className="h-4 w-4" />;
      case "monitoring": return <Target className="h-4 w-4" />;
      case "soil-health": return <Recycle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (taskFilter === "all") return true;
    if (taskFilter === "pending") return task.status === "pending";
    if (taskFilter === "completed") return task.status === "completed";
    return true;
  });

  const completedTasks = tasks.filter(task => task.status === "completed").length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 to-emerald-50">
      <Navbar />
      
      <main className="container px-4 py-8 flex-1">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <h1 className="text-4xl font-bold text-gray-900">Organic Farming & Daily Tasks</h1>
            <p className="text-lg text-gray-600">
              Sustainable farming practices and intelligent task management
            </p>
          </div>

          <Tabs defaultValue="tips" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="tips">🌱 Organic Tips</TabsTrigger>
              <TabsTrigger value="tasks">📋 Daily Tasks</TabsTrigger>
            </TabsList>

            {/* Organic Tips Tab */}
            <TabsContent value="tips" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Organic Farming Techniques
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
                    <TabsList className="grid w-full grid-cols-4">
                      <TabsTrigger value="pestControl">🐛 Pest Control</TabsTrigger>
                      <TabsTrigger value="fertilizers">🌾 Fertilizers</TabsTrigger>
                      <TabsTrigger value="soilHealth">🌱 Soil Health</TabsTrigger>
                      <TabsTrigger value="waterManagement">💧 Water</TabsTrigger>
                    </TabsList>
                    
                    {Object.entries(organicTips).map(([category, data]) => (
                      <TabsContent key={category} value={category} className="mt-6">
                        <div className="mb-4">
                          <h3 className="text-xl font-semibold flex items-center gap-2 mb-2">
                            <data.icon className="h-5 w-5 text-green-600" />
                            {data.title}
                          </h3>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {data.tips.map((tip, index) => (
                            <Card key={index} className="border-gray-200 hover:shadow-md transition-shadow">
                              <CardHeader>
                                <CardTitle className="text-lg">{tip.name}</CardTitle>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-3 w-3" />
                                  <span>{tip.season}</span>
                                  <span className="text-green-600 font-medium">{tip.cost}</span>
                                </div>
                              </CardHeader>
                              <CardContent className="space-y-4">
                                <div>
                                  <h4 className="font-semibold mb-2">Preparation</h4>
                                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">
                                    {tip.description}
                                  </p>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Application</h4>
                                  <p className="text-sm text-gray-700">{tip.usage}</p>
                                </div>

                                <div>
                                  <h4 className="font-semibold mb-2">Benefits</h4>
                                  <ul className="text-sm text-gray-700 space-y-1">
                                    {tip.benefits.map((benefit, i) => (
                                      <li key={i} className="flex items-start gap-2">
                                        <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                                        {benefit}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </TabsContent>
                    ))}
                  </Tabs>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Daily Tasks Tab */}
            <TabsContent value="tasks" className="space-y-6">
              {/* Task Progress */}
              <Card className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-semibold">Today's Progress</h3>
                      <p className="text-green-100">
                        {completedTasks} of {totalTasks} tasks completed
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold">{Math.round(progressPercentage)}%</div>
                      <div className="text-green-100 text-sm">Complete</div>
                    </div>
                  </div>
                  <div className="w-full bg-green-700 rounded-full h-2">
                    <div 
                      className="bg-white rounded-full h-2 transition-all duration-300"
                      style={{ width: `${progressPercentage}%` }}
                    ></div>
                  </div>
                </CardContent>
              </Card>

              {/* Task Controls */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Filter className="h-4 w-4 text-gray-600" />
                      <select 
                        value={taskFilter}
                        onChange={(e) => setTaskFilter(e.target.value)}
                        className="px-3 py-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      >
                        <option value="all">All Tasks</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>
                    
                    <button 
                      onClick={() => setShowAddTask(!showAddTask)}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
                      Add Task
                    </button>
                  </div>

                  {/* Add Task Form */}
                  {showAddTask && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newTask}
                          onChange={(e) => setNewTask(e.target.value)}
                          placeholder="Enter new task..."
                          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                          onKeyPress={(e) => e.key === 'Enter' && addTask()}
                        />
                        <button 
                          onClick={addTask}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Add
                        </button>
                        <button 
                          onClick={() => setShowAddTask(false)}
                          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Task List */}
              <div className="grid grid-cols-1 gap-4">
                {filteredTasks.map((task) => (
                  <Card key={task.id} className={`transition-all duration-200 ${
                    task.status === 'completed' ? 'bg-green-50 border-green-200' : 'hover:shadow-md'
                  }`}>
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3 flex-1">
                          <button
                            onClick={() => toggleTaskStatus(task.id)}
                            className={`mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                              task.status === 'completed' 
                                ? 'bg-green-500 border-green-500' 
                                : 'border-gray-300 hover:border-green-500'
                            }`}
                          >
                            {task.status === 'completed' && (
                              <CheckCircle className="h-3 w-3 text-white" />
                            )}
                          </button>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className={`font-semibold ${
                                task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                              }`}>
                                {task.title}
                              </h3>
                              <Badge className={getPriorityColor(task.priority)}>
                                {task.priority}
                              </Badge>
                            </div>
                            
                            <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                            
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {task.dueTime}
                              </div>
                              <div className="flex items-center gap-1">
                                {getCategoryIcon(task.category)}
                                {task.estimatedTime}
                              </div>
                              <div className="flex items-center gap-1">
                                <Sun className="h-3 w-3" />
                                {task.location}
                              </div>
                              <div className="text-green-600">
                                {task.weather}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-1 ml-4">
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredTasks.length === 0 && (
                <Card>
                  <CardContent className="pt-6 text-center">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {taskFilter === 'completed' ? 'No completed tasks yet' : 'No pending tasks'}
                    </h3>
                    <p className="text-gray-600">
                      {taskFilter === 'completed' 
                        ? 'Complete some tasks to see them here' 
                        : 'All tasks are completed! Great job!'
                      }
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default OrganicFarmingTips;