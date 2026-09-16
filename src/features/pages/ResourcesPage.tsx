import React, { useState, useEffect } from 'react';
import { Download, FileText, CheckCircle, Sparkles, BookOpen } from 'lucide-react';
import { api } from '../../services/api';
import { ResourceItem } from '../../types';
import { Card } from '../../components/common/Card';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

interface ResourcesPageProps {
  onNavigate: (view: string, params?: Record<string, any>) => void;
}

export const ResourcesPage: React.FC<ResourcesPageProps> = ({ onNavigate }) => {
  const [resources, setResources] = useState<ResourceItem[]>([]);
  const [downloadModalItem, setDownloadModalItem] = useState<ResourceItem | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [isDownloaded, setIsDownloaded] = useState(false);

  useEffect(() => {
    async function loadResources() {
      const data = await api.getResources();
      setResources(data);
    }
    loadResources();
  }, []);

  const handleDownload = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDownloaded(true);
    setTimeout(() => {
      setDownloadModalItem(null);
      setIsDownloaded(false);
      setEmailInput('');
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 space-y-12">
      {/* Banner */}
      <div className="bg-[#FAF8F5] rounded-3xl border border-[#E7DFD4] p-8 md:p-12 space-y-4">
        <Badge variant="terracotta" size="md">Free Printables & Guides</Badge>
        <h1 className="font-serif text-3xl sm:text-5xl text-[#211C15] font-normal leading-tight">
          Nourishing Tools For Your Home
        </h1>
        <p className="text-base sm:text-lg text-[#594D3C] max-w-2xl leading-relaxed">
          Tangible checklists, somatic calming guides, and boundary scripts you can print, stick to your refrigerator, or save to your phone for emergency calm.
        </p>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {resources.map(res => (
          <Card key={res.id} className="p-8 flex flex-col justify-between space-y-6 border-[#E7DFD4]">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Badge variant="sage" size="sm" className="capitalize">{res.category}</Badge>
                <span className="text-xs text-[#A8957C] font-mono">{res.format} &bull; {res.fileSize}</span>
              </div>

              <h3 className="font-serif text-2xl text-[#211C15] font-normal leading-snug">
                {res.title}
              </h3>

              <p className="text-xs sm:text-sm text-[#594D3C] leading-relaxed">
                {res.description}
              </p>
            </div>

            <div className="pt-4 border-t border-[#F3EFE9] space-y-3">
              <div className="text-xs text-[#7E6D56]">
                {res.downloadCount.toLocaleString()} downloads to date
              </div>

              <Button
                variant="primary"
                size="md"
                className="w-full"
                onClick={() => setDownloadModalItem(res)}
                icon={<Download className="w-4 h-4" />}
              >
                Download Guide Free
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Download Modal */}
      <Modal
        isOpen={Boolean(downloadModalItem)}
        onClose={() => setDownloadModalItem(null)}
        title={`Download "${downloadModalItem?.title}"`}
        subtitle="We will send the PDF guide directly to your inbox so you always have it on hand."
        maxWidth="md"
      >
        {isDownloaded ? (
          <div className="p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#EEF2EB] text-[#5D7052] flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-xl text-[#211C15]">Guide Dispatched!</h4>
            <p className="text-sm text-[#594D3C]">
              Your download link has been sent to {emailInput || 'your email'}. Check your inbox in the next 2 minutes.
            </p>
          </div>
        ) : (
          <form onSubmit={handleDownload} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#594D3C] uppercase mb-1">
                Where should we send your guide?
              </label>
              <input
                type="email"
                required
                value={emailInput}
                onChange={e => setEmailInput(e.target.value)}
                placeholder="your.email@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-[#FAF8F5] border border-[#D2C4B1] text-sm text-[#211C15] focus:outline-none focus:ring-2 focus:ring-[#B95B3D]/30"
              />
            </div>

            <div className="flex items-center justify-between pt-2">
              <Button type="button" variant="ghost" size="sm" onClick={() => setDownloadModalItem(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" size="md">
                Send Free PDF &rarr;
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
