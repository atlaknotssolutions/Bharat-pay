
// "use client"

// import { useState, useEffect } from "react"
// import { Plus, Edit, Trash2, Save, X, FolderTree } from "lucide-react"
// import {
//   addCategory,
//   deleteCategory,
//   fetchcategory,
//   updateCategory,
// } from "../../api.js"

// const CategoryManagement = () => {
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [newCategory, setNewCategory] = useState("")
//   const [editingCategory, setEditingCategory] = useState(null)
//   const [editName, setEditName] = useState("")

//   // ✅ FETCH CATEGORIES (FIXED)
//   useEffect(() => {
//     const fetchCategories = async () => {
//       setLoading(true)
//       try {
//         const response = await fetchcategory()

//         // 🔥 IMPORTANT FIX
//         const data =
//           Array.isArray(response?.data)
//             ? response.data
//             : Array.isArray(response?.data?.categories)
//             ? response.data.categories
//             : []

//         setCategories(data)
//       } catch (err) {
//         console.error("Error fetching categories:", err)
//         setError("Failed to load categories")
//         setCategories([])
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchCategories()
//   }, [])

//   // ✅ ADD CATEGORY
//   const handleAddCategory = async () => {
//     if (!newCategory.trim()) return

//     try {
//       const response = await addCategory(newCategory.trim())
//       const createdCategory = response?.data

//       if (createdCategory) {
//         setCategories((prev) => [...prev, createdCategory])
//       }

//       setNewCategory("")
//     } catch (err) {
//       console.error("Error adding category:", err)
//       setError("Failed to add category")
//     }
//   }

//   // ✅ EDIT CATEGORY
//   const handleEditCategory = (category) => {
//     setEditingCategory(category._id)
//     setEditName(category.name)
//   }

//   // ✅ SAVE EDIT
//   const handleSaveEdit = async (id) => {
//     if (!editName.trim()) return

//     try {
//       await updateCategory(id, editName.trim())

//       setCategories((prev) =>
//         prev.map((cat) =>
//           cat._id === id ? { ...cat, name: editName.trim() } : cat
//         )
//       )

//       setEditingCategory(null)
//       setEditName("")
//     } catch (err) {
//       console.error("Error updating category:", err)
//       setError("Failed to update category")
//     }
//   }

//   // ✅ DELETE CATEGORY
//   const handleDeleteCategory = async (id) => {
//     try {
//       await deleteCategory(id)
//       setCategories((prev) => prev.filter((cat) => cat._id !== id))
//     } catch (err) {
//       console.error("Error deleting category:", err)
//       setError("Failed to delete category")
//     }
//   }

//   return (
//     <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
//       <div className="px-6 py-4 bg-primary-600 text-white flex items-center">
//         <FolderTree className="mr-2" size={24} />
//         <h2 className="text-xl font-bold">Category Management</h2>
//       </div>

//       {error && (
//         <div className="p-4 bg-red-50 text-red-700 border-b">
//           {error}
//         </div>
//       )}

//       <div className="p-6">
//         {/* ADD CATEGORY */}
//         <div className="mb-6">
//           <h3 className="text-lg font-medium mb-3">Add New Category</h3>
//           <div className="flex">
//             <input
//               type="text"
//               value={newCategory}
//               onChange={(e) => setNewCategory(e.target.value)}
//               placeholder="Enter category name"
//               className="flex-1 px-4 py-2 border rounded-l-md"
//             />
//             <button
//               onClick={handleAddCategory}
//               disabled={!newCategory.trim()}
//               className="px-4 py-2 bg-primary-600 text-white rounded-r-md flex items-center"
//             >
//               <Plus size={18} className="mr-1" />
//               Add
//             </button>
//           </div>
//         </div>

//         {/* CATEGORY LIST */}
//         <h3 className="text-lg font-medium mb-3">Categories</h3>

//         {loading ? (
//           <div className="text-center py-4">Loading...</div>
//         ) : categories.length === 0 ? (
//           <div className="text-center py-4 text-gray-500">
//             No categories found.
//           </div>
//         ) : (
//           <div className="border rounded-md overflow-hidden">
//             <table className="min-w-full divide-y">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium">
//                     Name
//                   </th>
//                   <th className="px-6 py-3 text-right text-xs font-medium">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>

//               <tbody className="divide-y">
//                 {Array.isArray(categories) &&
//                   categories.map((category) => (
//                     <tr key={category._id}>
//                       <td className="px-6 py-4">
//                         {editingCategory === category._id ? (
//                           <input
//                             value={editName}
//                             onChange={(e) => setEditName(e.target.value)}
//                             className="w-full border px-2 py-1"
//                           />
//                         ) : (
//                           category.name
//                         )}
//                       </td>

//                       <td className="px-6 py-4 text-right">
//                         {editingCategory === category._id ? (
//                           <>
//                             <button
//                               onClick={() =>
//                                 handleSaveEdit(category._id)
//                               }
//                               className="mr-2 text-green-600"
//                             >
//                               <Save size={18} />
//                             </button>
//                             <button
//                               onClick={() => setEditingCategory(null)}
//                               className="text-gray-600"
//                             >
//                               <X size={18} />
//                             </button>
//                           </>
//                         ) : (
//                           <>
//                             <button
//                               onClick={() =>
//                                 handleEditCategory(category)
//                               }
//                               className="mr-3 text-blue-600"
//                             >
//                               <Edit size={18} />
//                             </button>
//                             <button
//                               onClick={() =>
//                                 handleDeleteCategory(category._id)
//                               }
//                               className="text-red-600"
//                             >
//                               <Trash2 size={18} />
//                             </button>
//                           </>
//                         )}
//                       </td>
//                     </tr>
//                   ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   )
// }

// export default CategoryManagement


// "use client"

// import { useState, useEffect } from "react"
// import { 
//   Plus, 
//   Edit, 
//   Trash2, 
//   Save, 
//   X, 
//   FolderTree, 
//   Loader2 
// } from "lucide-react"
// import {
//   addCategory,
//   deleteCategory,
//   fetchcategory,
//   updateCategory,
// } from "../../api.js"

// const CategoryManagement = () => {
//   const [categories, setCategories] = useState([])
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState(null)
//   const [newCategory, setNewCategory] = useState("")
//   const [editingCategory, setEditingCategory] = useState(null)
//   const [editName, setEditName] = useState("")

//   // Fetch all categories
//   useEffect(() => {
//     const fetchCategories = async () => {
//       setLoading(true)
//       try {
//         const response = await fetchcategory()
//         const data = Array.isArray(response?.data)
//           ? response.data
//           : Array.isArray(response?.data?.categories)
//           ? response.data.categories
//           : []
        
//         setCategories(data)
//       } catch (err) {
//         console.error("Error fetching categories:", err)
//         setError("Failed to load categories")
//       } finally {
//         setLoading(false)
//       }
//     }

//     fetchCategories()
//   }, [])

//   // Add new category
//   const handleAddCategory = async () => {
//     if (!newCategory.trim()) return

//     try {
//       const response = await addCategory(newCategory.trim())
//       const created = response?.data

//       if (created) {
//         setCategories(prev => [...prev, created])
//         setNewCategory("")
//       }
//     } catch (err) {
//       console.error("Error adding category:", err)
//       setError("Failed to add category")
//     }
//   }

//   // Start editing
//   const handleEditCategory = (category) => {
//     setEditingCategory(category._id)
//     setEditName(category.name)
//   }

//   // Save edited category
//   const handleSaveEdit = async (id) => {
//     if (!editName.trim()) return

//     try {
//       await updateCategory(id, editName.trim())

//       setCategories(prev =>
//         prev.map(cat =>
//           cat._id === id ? { ...cat, name: editName.trim() } : cat
//         )
//       )

//       setEditingCategory(null)
//       setEditName("")
//     } catch (err) {
//       console.error("Error updating category:", err)
//       setError("Failed to update category")
//     }
//   }

//   // Delete category
//   const handleDeleteCategory = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this category?")) return

//     try {
//       await deleteCategory(id)
//       setCategories(prev => prev.filter(cat => cat._id !== id))
//     } catch (err) {
//       console.error("Error deleting category:", err)
//       setError("Failed to delete category")
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gray-950 text-gray-100 p-6">
//       <div className="max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="flex items-center justify-between mb-8">
//           <div className="flex items-center gap-3">
//             <div className="p-3 bg-indigo-600/20 rounded-xl">
//               <FolderTree className="text-indigo-400" size={28} />
//             </div>
//             <h1 className="text-2xl font-bold tracking-tight">Category Management</h1>
//           </div>
//         </div>

//         {/* Error Message */}
//         {error && (
//           <div className="mb-6 p-4 bg-red-900/30 border border-red-700/50 text-red-300 rounded-xl flex items-center gap-3">
//             <span className="font-medium">{error}</span>
//           </div>
//         )}

//         <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-2xl shadow-2xl overflow-hidden">

//           {/* Add New Category Section */}
//           <div className="p-6 border-b border-gray-800">
//             <h2 className="text-lg font-semibold mb-4 text-gray-200">Add New Category</h2>
            
//             <div className="flex gap-3">
//               <input
//                 type="text"
//                 value={newCategory}
//                 onChange={(e) => setNewCategory(e.target.value)}
//                 placeholder="Enter category name..."
//                 className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl 
//                          focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30
//                          text-white placeholder-gray-500 transition-all"
//               />
//               <button
//                 onClick={handleAddCategory}
//                 disabled={!newCategory.trim() || loading}
//                 className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 
//                          text-white font-medium rounded-xl flex items-center gap-2 
//                          disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
//               >
//                 {loading ? (
//                   <Loader2 size={18} className="animate-spin" />
//                 ) : (
//                   <Plus size={18} />
//                 )}
//                 Add Category
//               </button>
//             </div>
//           </div>

//           {/* Categories List */}
//           <div className="p-6">
//             <h2 className="text-lg font-semibold mb-4 text-gray-200">All Categories</h2>

//             {loading ? (
//               <div className="flex flex-col items-center justify-center py-12">
//                 <Loader2 size={32} className="animate-spin text-indigo-500 mb-4" />
//                 <p className="text-gray-400">Loading categories...</p>
//               </div>
//             ) : categories.length === 0 ? (
//               <div className="text-center py-12 text-gray-500">
//                 <p className="text-lg">No categories found</p>
//                 <p className="text-sm mt-2">Start by adding a new category above</p>
//               </div>
//             ) : (
//               <div className="space-y-2">
//                 {categories.map((category) => (
//                   <div
//                     key={category._id}
//                     className="flex items-center justify-between px-5 py-4 
//                              bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700/50 
//                              rounded-xl transition-all duration-200 group"
//                   >
//                     {editingCategory === category._id ? (
//                       <input
//                         value={editName}
//                         onChange={(e) => setEditName(e.target.value)}
//                         autoFocus
//                         className="flex-1 px-3 py-2 bg-gray-900 border border-gray-700 rounded-lg
//                                  focus:outline-none focus:border-indigo-500 text-white"
//                       />
//                     ) : (
//                       <div className="text-gray-200 font-medium">{category.name}</div>
//                     )}

//                     <div className="flex items-center gap-2">
//                       {editingCategory === category._id ? (
//                         <>
//                           <button
//                             onClick={() => handleSaveEdit(category._id)}
//                             className="p-2 text-green-400 hover:bg-green-900/40 rounded-lg transition-colors"
//                             title="Save"
//                           >
//                             <Save size={18} />
//                           </button>
//                           <button
//                             onClick={() => {
//                               setEditingCategory(null)
//                               setEditName("")
//                             }}
//                             className="p-2 text-gray-400 hover:bg-gray-700 rounded-lg transition-colors"
//                             title="Cancel"
//                           >
//                             <X size={18} />
//                           </button>
//                         </>
//                       ) : (
//                         <>
//                           <button
//                             onClick={() => handleEditCategory(category)}
//                             className="p-2 text-blue-400 hover:bg-blue-900/40 rounded-lg transition-colors"
//                             title="Edit"
//                           >
//                             <Edit size={18} />
//                           </button>
//                           <button
//                             onClick={() => handleDeleteCategory(category._id)}
//                             className="p-2 text-red-400 hover:bg-red-900/40 rounded-lg transition-colors"
//                             title="Delete"
//                           >
//                             <Trash2 size={18} />
//                           </button>
//                         </>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default CategoryManagement

"use client"

import { useState, useEffect } from "react"
import { 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  FolderTree, 
  Loader2 
} from "lucide-react"
import {
  addCategory,
  deleteCategory,
  fetchcategory,
  updateCategory,
} from "../../api.js"

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newCategory, setNewCategory] = useState("")
  const [editingCategory, setEditingCategory] = useState(null)
  const [editName, setEditName] = useState("")

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true)
      try {
        const response = await fetchcategory()
        const data = Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response?.data?.categories)
          ? response.data.categories
          : []
        
        setCategories(data)
      } catch (err) {
        console.error("Error fetching categories:", err)
        setError("Failed to load categories")
      } finally {
        setLoading(false)
      }
    }

    fetchCategories()
  }, [])

  // Add new category
  const handleAddCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const response = await addCategory(newCategory.trim())
      const created = response?.data

      if (created) {
        setCategories(prev => [...prev, created])
        setNewCategory("")
      }
    } catch (err) {
      console.error("Error adding category:", err)
      setError("Failed to add category")
    }
  }

  // Start editing
  const handleEditCategory = (category) => {
    setEditingCategory(category._id)
    setEditName(category.name)
  }

  // Save edited category
  const handleSaveEdit = async (id) => {
    if (!editName.trim()) return

    try {
      await updateCategory(id, editName.trim())

      setCategories(prev =>
        prev.map(cat =>
          cat._id === id ? { ...cat, name: editName.trim() } : cat
        )
      )

      setEditingCategory(null)
      setEditName("")
    } catch (err) {
      console.error("Error updating category:", err)
      setError("Failed to update category")
    }
  }

  // Delete category
  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) return

    try {
      await deleteCategory(id)
      setCategories(prev => prev.filter(cat => cat._id !== id))
    } catch (err) {
      console.error("Error deleting category:", err)
      setError("Failed to delete category")
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-indigo-100 rounded-xl">
              <FolderTree className="text-indigo-600" size={28} />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              Category Management
            </h1>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

          {/* Add New Category Section */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Add New Category</h2>
            
            <div className="flex gap-3">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Enter category name..."
                className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-xl 
                         focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50
                         text-gray-900 placeholder-gray-500 transition-all"
              />
              <button
                onClick={handleAddCategory}
                disabled={!newCategory.trim() || loading}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 
                         text-white font-medium rounded-xl flex items-center gap-2 
                         disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Plus size={18} />
                )}
                Add Category
              </button>
            </div>
          </div>

          {/* Categories List */}
          <div className="p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">All Categories</h2>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Loader2 size={32} className="animate-spin text-indigo-600 mb-4" />
                <p className="text-gray-600">Loading categories...</p>
              </div>
            ) : categories.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p className="text-lg">No categories found</p>
                <p className="text-sm mt-2">Start by adding a new category above</p>
              </div>
            ) : (
              <div className="space-y-2">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className="flex items-center justify-between px-5 py-4 
                             bg-white hover:bg-gray-50 border border-gray-200 
                             rounded-xl transition-all duration-200 shadow-sm hover:shadow"
                  >
                    {editingCategory === category._id ? (
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        autoFocus
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg
                                 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200/50
                                 text-gray-900"
                      />
                    ) : (
                      <div className="text-gray-800 font-medium">{category.name}</div>
                    )}

                    <div className="flex items-center gap-2">
                      {editingCategory === category._id ? (
                        <>
                          <button
                            onClick={() => handleSaveEdit(category._id)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Save"
                          >
                            <Save size={18} />
                          </button>
                          <button
                            onClick={() => {
                              setEditingCategory(null)
                              setEditName("")
                            }}
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            title="Cancel"
                          >
                            <X size={18} />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditCategory(category)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDeleteCategory(category._id)}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete"
                          >
                            <Trash2 size={18} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryManagement