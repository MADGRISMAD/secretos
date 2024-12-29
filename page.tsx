"use client"

import { useState } from "react"
import { Upload, Lock, Search, Download, Shield, Eye, KeyRound, Terminal, Binary, Cpu, Fingerprint, ArrowRight, Radar, FileWarning } from "'lucide-react'"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { SteganographyService } from "@/utils/steganography"
import { useToast } from "@/components/ui/use-toast"

export default function SteganoSaas() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [encodedImage, setEncodedImage] = useState<string | null>(null)
  const [message, setMessage] = useState("")
  const [isEncoding, setIsEncoding] = useState(false)
  const [isDecoding, setIsDecoding] = useState(false)
  const [decodedImage, setDecodedImage] = useState<string | null>(null)
  const [decodedMessage, setDecodedMessage] = useState<string>("")
  const { toast } = useToast()

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setSelectedImage(reader.result as string)
        setEncodedImage(null)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleEncode = async () => {
    if (!selectedImage || !message) {
      toast({
        title: "Error",
        description: "Please select an image and enter a message",
        variant: "destructive"
      })
      return
    }

    try {
      setIsEncoding(true)
      const imageData = await SteganographyService.imageToImageData(selectedImage)
      const encodedData = await SteganographyService.encodeMessage(imageData, message)
      const encodedUrl = await SteganographyService.imageDataToUrl(encodedData)
      setEncodedImage(encodedUrl)
      toast({
        title: "Success",
        description: "Message encoded successfully!",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to encode message",
        variant: "destructive"
      })
    } finally {
      setIsEncoding(false)
    }
  }

  const handleDecode = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setIsDecoding(true)
      const reader = new FileReader()
      reader.onloadend = async () => {
        const imageUrl = reader.result as string
        setDecodedImage(imageUrl)
        const imageData = await SteganographyService.imageToImageData(imageUrl)
        const message = await SteganographyService.decodeMessage(imageData)
        setDecodedMessage(message)
        toast({
          title: "Success",
          description: "Message decoded successfully!",
        })
      }
      reader.readAsDataURL(file)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to decode message",
        variant: "destructive"
      })
    } finally {
      setIsDecoding(false)
    }
  }

  const handleDownload = () => {
    if (!encodedImage) return
    
    const link = document.createElement("'a'")
    link.href = encodedImage
    link.download = "'encoded-image.png'"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-black text-neutral-400 overflow-hidden font-mono">
      {/* Minimal Background */}
      <div className="fixed inset-0 minimal-grid opacity-20" />
      <div className="fixed inset-0 minimal-scanline" />
      
      <div className="relative">
        {/* Navbar */}
        <nav className="border-b border-neutral-800 bg-black/50 backdrop-blur-xl">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-neutral-500" />
                <span className="text-lg font-medium tracking-wider text-neutral-300">
                  SHADOW_SYSTEM
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-xs tracking-wider text-neutral-500">
                  ACCESS_LEVEL: CLASSIFIED
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-12">
          <Card className="bg-neutral-900/50 border-neutral-800 backdrop-blur-xl subtle-glow">
            <CardContent className="p-8">
              {/* Header */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-medium tracking-wider text-neutral-200 mb-2">
                      Secure Message Encryption
                    </h1>
                    <p className="text-sm text-neutral-500">
                      Hide messages in images using advanced steganography
                    </p>
                  </div>
                  <div className="px-3 py-1.5 bg-neutral-800/50 rounded-md">
                    <div className="text-xs tracking-wider text-neutral-500 flex items-center gap-2">
                      <Shield className="w-4 h-4" />
                      <span>CLEARANCE GRANTED</span>
                    </div>
                  </div>
                </div>
              </div>

              <Tabs defaultValue="encode" className="space-y-6">
                <TabsList className="w-full bg-black/20 border border-neutral-200 border-neutral-800 rounded-md p-1 dark:border-neutral-800">
                  <TabsTrigger 
                    value="encode" 
                    className="flex-1 data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-200"
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Hide Message
                  </TabsTrigger>
                  <TabsTrigger 
                    value="decode"
                    className="flex-1 data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-200"
                  >
                    <Search className="w-4 h-4 mr-2" />
                    Reveal Message
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="encode">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Controls */}
                    <div className="space-y-6">
                      {/* Image Upload */}
                      <div className="bg-black/20 border border-neutral-200 border-neutral-800 rounded-lg p-6 dark:border-neutral-800">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                          id="image-upload"
                        />
                        <label
                          htmlFor="image-upload"
                          className="group cursor-pointer block"
                        >
                          <div className="border-2 border-dashed border-neutral-800 rounded-lg p-6 text-center transition-colors hover:border-neutral-700">
                            {selectedImage ? (
                              <div className="space-y-3">
                                <img
                                  src={selectedImage}
                                  alt="Selected"
                                  className="max-h-48 mx-auto object-contain rounded"
                                />
                                <p className="text-sm text-neutral-400">
                                  Click to change image
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-3">
                                <Upload className="w-8 h-8 mx-auto text-neutral-500 group-hover:text-neutral-400 transition-colors" />
                                <p className="text-sm text-neutral-400">
                                  Drop image here or click to upload
                                </p>
                              </div>
                            )}
                          </div>
                        </label>
                      </div>

                      {/* Message Input */}
                      <div className="bg-black/20 border border-neutral-200 border-neutral-800 rounded-lg p-6 space-y-4 dark:border-neutral-800">
                        <Input
                          type="text"
                          placeholder="Enter your secret message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          className="bg-black/20 border-neutral-800 text-neutral-300 h-12"
                        />
                        <Button 
                          className="w-full bg-neutral-800 hover:bg-neutral-700 text-neutral-300 h-12"
                          onClick={handleEncode}
                          disabled={isEncoding || !selectedImage || !message}
                        >
                          {isEncoding ? (
                            <div className="flex items-center gap-2">
                              <div className="animate-spin rounded-full h-4 w-4 border-2 border-b-transparent border-current" />
                              <span>Processing...</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <Lock className="w-4 h-4" />
                              <span>Hide Message in Image</span>
                            </div>
                          )}
                        </Button>
                      </div>
                    </div>

                    {/* Right Column - Result */}
                    <div className="bg-black/20 border border-neutral-200 border-neutral-800 rounded-lg p-6 dark:border-neutral-800">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h2 className="text-sm font-medium text-neutral-300">Result</h2>
                          {encodedImage && (
                            <div className="text-xs text-emerald-500 flex items-center gap-2">
                              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                              Message Hidden
                            </div>
                          )}
                        </div>
                        <div className="aspect-video rounded-lg overflow-hidden bg-black/40 border border-neutral-200 border-neutral-800 flex items-center justify-center dark:border-neutral-800">
                          {encodedImage ? (
                            <img
                              src={encodedImage}
                              alt="Encoded"
                              className="w-full h-full object-contain"
                            />
                          ) : (
                            <p className="text-sm text-neutral-600">
                              Encoded image will appear here
                            </p>
                          )}
                        </div>
                        {encodedImage && (
                          <Button 
                            variant="outline" 
                            className="w-full border-neutral-800 text-neutral-400 hover:bg-neutral-800 h-12"
                            onClick={handleDownload}
                          >
                            <Download className="w-4 h-4 mr-2" />
                            Download Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="decode">
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Left Column - Upload */}
                    <div className="bg-black/20 border border-neutral-200 border-neutral-800 rounded-lg p-6 dark:border-neutral-800">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleDecode}
                        className="hidden"
                        id="decode-image-upload"
                      />
                      <label
                        htmlFor="decode-image-upload"
                        className="group cursor-pointer block"
                      >
                        <div className="border-2 border-dashed border-neutral-800 rounded-lg p-6 text-center transition-colors hover:border-neutral-700">
                          {decodedImage ? (
                            <div className="space-y-3">
                              <img
                                src={decodedImage}
                                alt="Decoded"
                                className="max-h-48 mx-auto object-contain rounded"
                              />
                              <p className="text-sm text-neutral-400">
                                Click to decode another image
                              </p>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              <Search className="w-8 h-8 mx-auto text-neutral-500 group-hover:text-neutral-400 transition-colors" />
                              <p className="text-sm text-neutral-400">
                                Upload image to reveal message
                              </p>
                            </div>
                          )}
                        </div>
                      </label>
                    </div>

                    {/* Right Column - Message */}
                    <div className="bg-black/20 border border-neutral-200 border-neutral-800 rounded-lg p-6 dark:border-neutral-800">
                      <div className="space-y-4">
                        <h2 className="text-sm font-medium text-neutral-300">Hidden Message</h2>
                        {decodedMessage ? (
                          <div className="p-4 bg-black/40 border border-neutral-200 border-neutral-800 rounded-lg dark:border-neutral-800">
                            <p className="text-sm text-neutral-300 font-medium">{decodedMessage}</p>
                          </div>
                        ) : (
                          <div className="aspect-video rounded-lg overflow-hidden bg-black/40 border border-neutral-200 border-neutral-800 flex items-center justify-center dark:border-neutral-800">
                            <p className="text-sm text-neutral-600">
                              Hidden message will appear here
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="p-4 bg-neutral-900/50 border border-neutral-200 border-neutral-800 rounded-md backdrop-blur-xl dark:border-neutral-800">
              <Shield className="w-6 h-6 text-neutral-500 mb-3" />
              <h3 className="text-sm font-medium text-neutral-300 mb-2">Secure Encoding</h3>
              <p className="text-xs text-neutral-500">Advanced steganographic algorithms for maximum security.</p>
            </div>
            <div className="p-4 bg-neutral-900/50 border border-neutral-200 border-neutral-800 rounded-md backdrop-blur-xl dark:border-neutral-800">
              <Terminal className="w-6 h-6 text-neutral-500 mb-3" />
              <h3 className="text-sm font-medium text-neutral-300 mb-2">Covert Operations</h3>
              <p className="text-xs text-neutral-500">Field-tested steganography system for sensitive data.</p>
            </div>
            <div className="p-4 bg-neutral-900/50 border border-neutral-200 border-neutral-800 rounded-md backdrop-blur-xl dark:border-neutral-800">
              <Cpu className="w-6 h-6 text-neutral-500 mb-3" />
              <h3 className="text-sm font-medium text-neutral-300 mb-2">Real-time Processing</h3>
              <p className="text-xs text-neutral-500">Instant encoding and decoding capabilities.</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-neutral-800 mt-12 py-6">
          <div className="container mx-auto px-6">
            <div className="text-center text-xs text-neutral-600">
              Secure Steganography System • {new Date().getFullYear()}
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

