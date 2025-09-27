'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAuth } from '@/contexts/AuthContext'
// import LinearBuffer from '@/components/LinearBuffer'
import { Card, CardHeader, CardBody, Image, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button } from '@heroui/react'

interface Collection {
  id: number
  title: string
  description: string
  target_amount?: number
  current_amount: number
  currency: string
  status: string
  is_public: boolean
  start_date?: string
  end_date?: string
  created_at: string
  created_by: number
}

interface ContributionCardProps {
  collection: Collection
  index: number
  onContribute: (collectionId: number) => void
}

const ContributionCard = ({ collection, index, onContribute }: ContributionCardProps) => {
  const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>({})

  const progress = collection.target_amount
    ? Math.min((collection.current_amount / collection.target_amount) * 100, 100)
    : 0

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GH', {
      style: 'currency',
      currency: collection.currency || 'GHS'
    }).format(amount)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
      className="cursor-pointer h-full"
      onClick={() => onContribute(collection.id)}
    >
      <Card className="py-4 border-0 shadow-lg hover:shadow-xl transition-shadow h-full flex flex-col">
        <CardHeader className="pb-0 pt-2 px-4 flex-col items-start">
          {/* Main heading */}
          <h3 className="text-xl font-bold text-black mb-2 leading-tight">
            {collection.title}
          </h3>

          {/* Status subheading */}
          <div className="flex justify-between items-center w-full mb-2">
            <h4 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
              {collection.status}
            </h4>
          </div>

          {/* Description Section */}
          <div className="mb-3">
            <h5 className="text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Description</h5>
            <p className={`text-sm text-black leading-relaxed ${expandedCards[collection.id] ? '' : 'line-clamp-2'}`}>
              {collection.description}
            </p>
            {collection.description && collection.description.length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  setExpandedCards(prev => ({
                    ...prev,
                    [collection.id]: !prev[collection.id]
                  }))
                }}
                className="text-red-600 hover:text-red-800 text-xs font-medium mt-1"
              >
                {expandedCards[collection.id] ? 'Show less' : 'Read more'}
              </button>
            )}
          </div>

          {/* Details Section */}
          <div className="flex justify-between items-center w-full pt-2 border-t border-gray-100 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs text-black font-bold uppercase tracking-wide">
                {collection.currency}
              </span>
              <span className="text-xs text-gray-600">•</span>
              <span className="text-xs text-black opacity-75">
                {new Date(collection.created_at).toLocaleDateString('en-GH', {
                  month: 'short',
                  day: 'numeric'
                })}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardBody className="overflow-visible py-2 flex flex-col flex-1">
          {/* Progress and Amount Information Section - Only for cards with target amount */}
          {collection.target_amount && (
            <div className="mb-3 flex-shrink-0">
              {/* Progress bar with percentage */}
              <div className="mb-2">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm text-black font-medium">{progress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden mb-1">
                  <motion.div
                    className="bg-gradient-to-r from-red-500 to-red-600 h-full rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>

                {/* Amount information in separate div */}
                <div className="flex justify-between items-center text-xs text-black">
                  <span className="font-medium">Raised: {formatCurrency(collection.current_amount)}</span>
                  <span className="font-medium">Goal: {formatCurrency(collection.target_amount)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Amount Information Section - For cards without target amount */}
          {!collection.target_amount && (
            <div className="mb-3 flex-shrink-0">
              <div className="text-center">
                <div className="text-lg font-bold text-black mb-1">
                  {formatCurrency(collection.current_amount)}
                </div>
                <p className="text-xs text-gray-600">Total Raised</p>
              </div>
            </div>
          )}

          {/* Reduced spacer to bring elements closer */}
          <div className="h-[16px] flex-shrink-0"></div>

          {/* Contribute Button - positioned at bottom like school fees card */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors mt-auto"
          >
            Contribute Now
          </motion.button>
        </CardBody>
      </Card>
    </motion.div>
  )
}

export default function ContributionsPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedKeys, setSelectedKeys] = useState(new Set(["all"]))

  const filterStatus = Array.from(selectedKeys)[0] || 'all'

  useEffect(() => {
    fetchCollections()
  }, [])

  const fetchCollections = async () => {
    try {
      const response = await fetch('/api/collections')
      if (!response.ok) throw new Error('Failed to fetch collections')
      const data = await response.json()
      setCollections(data.collections || [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch collections')
    } finally {
      setLoading(false)
    }
  }

  const handleContribute = (collectionId: number) => {
    router.push(`/payment?collection=${collectionId}`)
  }

  const filteredCollections = collections.filter(collection => {
    const matchesSearch = collection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         collection.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'all' || collection.status.toLowerCase() === filterStatus.toLowerCase()
    return matchesSearch && matchesStatus && collection.is_public
  })

  const stats = {
    totalCollections: collections.filter(c => c.is_public).length,
    activeCollections: collections.filter(c => c.is_public && c.status.toLowerCase() === 'active').length,
    totalRaised: collections.reduce((sum, c) => sum + c.current_amount, 0)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-4">
            <div className="loader mx-auto"></div>
          </div>
          <p className="text-black">Loading contributions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Support Contributions</h1>
            <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
              Browse and contribute to meaningful causes that make a difference in our community
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              >
                <div className="text-3xl font-bold mb-2">{stats.totalCollections}</div>
                <div className="text-red-100">Active Contributions</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              >
                <div className="text-3xl font-bold mb-2">
                  {new Intl.NumberFormat('en-GH', {
                    style: 'currency',
                    currency: 'GHS'
                  }).format(stats.totalRaised)}
                </div>
                <div className="text-red-100">Total Raised</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="bg-white/10 backdrop-blur-sm rounded-lg p-6"
              >
                <div className="text-3xl font-bold mb-2">{stats.activeCollections}</div>
                <div className="text-red-100">Active Now</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-black mb-2">Find Your Cause</h2>
            <p className="text-gray-600">Search and filter through our collection of meaningful contributions</p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-center max-w-4xl mx-auto">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Search contributions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-black placeholder-gray-400"
              />
              <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <Dropdown>
              <DropdownTrigger>
                <Button className="capitalize text-black bg-white border-2 border-red-600 shadow-lg hover:shadow-xl transition-all font-semibold" variant="bordered">
                  {filterStatus === 'all' ? 'All Status' : filterStatus.charAt(0).toUpperCase() + filterStatus.slice(1)}
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="Filter by status"
                selectedKeys={selectedKeys}
                selectionMode="single"
                variant="flat"
                onSelectionChange={setSelectedKeys}
                className="bg-white border border-gray-200 shadow-lg"
              >
                <DropdownItem key="all" className="text-black hover:bg-red-50">All Status</DropdownItem>
                <DropdownItem key="active" className="text-black hover:bg-red-50">Active</DropdownItem>
                <DropdownItem key="completed" className="text-black hover:bg-red-50">Completed</DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </div>
      </section>

      {/* Collections Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">Active Contributions</h2>
            <p className="text-gray-600">Click on any contribution to make a difference</p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 bg-red-50 border border-red-200 rounded-lg p-4"
            >
              <p className="text-red-800 text-center">{error}</p>
            </motion.div>
          )}

          {filteredCollections.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-xl font-semibold text-black mb-2">No contributions found</h3>
              <p className="text-black">Try adjusting your search or filter criteria</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 auto-rows-fr">
              {filteredCollections.map((collection, index) => (
                <ContributionCard
                  key={collection.id}
                  collection={collection}
                  index={index}
                  onContribute={handleContribute}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h2 className="text-3xl font-bold mb-4">Ready to Make a Difference?</h2>
            <p className="text-xl text-gray-300 mb-8">
              Need help with payments or have questions about our platform? We're here to assist you.
            </p>
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/help')}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all shadow-lg hover:shadow-xl"
            >
              Help & Support
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}