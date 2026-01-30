import { useMeetingData } from './hooks/useMeetingData';
import { StatCard } from './components/StatCard';
import { Activity, FileText, MousePointer2, Search, Calendar, RefreshCw } from 'lucide-react';

function App() {
    const { data, loading, error } = useMeetingData();

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-background text-red-500">
            Error loading data: {error}
        </div>
    );

    if (!data) return null;

    // Manual Parsing Logic based on the specific CSV structure viewed
    // Row 1 (Index 0): Date [0][0]
    // Row 11 (Index 10): "新記事", [10][1] is value
    // Row 12 (Index 11): "リライト", [11][1] is value
    // Row 15+ (Index 14+): Affiliate data
    // Row 21+ (Index 20+): Search Console data

    const reportDate = data[0]?.[0] || 'Unknown Date';
    const newArticles = data[10]?.[1] || '0';
    const rewrites = data[11]?.[1] || '0';
    const siteOpenDate = data[6]?.[1] || '-';

    // Example Extraction for Search Console Top Query (Row 22 / Index 21)
    const topQuery = data[21]?.[0] || '-';
    const topQueryClicks = data[21]?.[1] || '0';

    // Calculate total clicks from Affiliate section approximately? 
    // Just manually picking a few examples for the MVP.

    return (
        <div className="min-h-screen bg-background p-8 md:p-12 font-sans text-foreground selection:bg-primary/30">
            <div className="max-w-6xl mx-auto space-y-12">

                {/* Header */}
                <header className="space-y-4">
                    <div className="flex items-center space-x-3">
                        <div className="h-8 w-1 bg-gradient-to-b from-primary to-accent rounded-full"></div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                            朝活ブログ部 <span className="gradient-text">Monthly Report</span>
                        </h1>
                    </div>
                    <p className="text-muted-foreground text-lg ml-4">
                        <Calendar className="inline-block w-5 h-5 mr-2 -mt-1 text-primary" />
                        {reportDate}
                    </p>
                </header>

                {/* Key Metrics Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        title="新記事作成"
                        value={newArticles}
                        subValue="今月の成果"
                        icon={<FileText />}
                        delay={1}
                    />
                    <StatCard
                        title="リライト"
                        value={rewrites}
                        subValue="既存記事の改善"
                        icon={<RefreshCw />}
                        delay={2}
                    />
                    <StatCard
                        title="Top Query"
                        value={topQueryClicks}
                        subValue={topQuery}
                        icon={<Search />}
                        delay={3}
                    />
                    <StatCard
                        title="ブログ開設"
                        value={siteOpenDate}
                        subValue="運用期間"
                        icon={<Activity />}
                        delay={4}
                    />
                </div>

                {/* Detailed Sections (Glass Panels) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Main Content / Analysis */}
                    <div className="lg:col-span-2 space-y-8">
                        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                            <h2 className="text-2xl font-bold mb-6 flex items-center">
                                <span className="w-2 h-8 bg-accent rounded-full mr-3"></span>
                                今月の取り組み・分析
                            </h2>

                            <div className="space-y-6 text-muted-foreground leading-relaxed">
                                <div className="p-4 bg-secondary/50 rounded-lg border border-border">
                                    <h3 className="text-foreground font-semibold mb-2 text-sm uppercase tracking-wider">Focus</h3>
                                    <p>{data[1]?.[0] || 'No focus set'}</p>
                                </div>

                                {/* Search Console Table (Preview) */}
                                <div>
                                    <h3 className="text-foreground font-semibold mb-4 text-sm uppercase tracking-wider">Search Console Topics</h3>
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm text-left">
                                            <thead className="bg-secondary/50 text-xs uppercase text-muted-foreground font-medium">
                                                <tr>
                                                    <th className="px-4 py-3 rounded-tl-lg">Query</th>
                                                    <th className="px-4 py-3">Clicks</th>
                                                    <th className="px-4 py-3">Impression</th>
                                                    <th className="px-4 py-3 rounded-tr-lg">Rank</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/40">
                                                {data.slice(21, 26).map((row, i) => (
                                                    <tr key={i} className="hover:bg-white/5 transition-colors">
                                                        <td className="px-4 py-3 font-medium text-primary">{row[0]}</td>
                                                        <td className="px-4 py-3">{row[1]}</td>
                                                        <td className="px-4 py-3">{row[2]}</td>
                                                        <td className="px-4 py-3">{row[4]}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div className="glass-panel p-6 rounded-2xl bg-gradient-to-br from-card to-secondary/30">
                            <h3 className="text-lg font-bold mb-4 flex items-center text-white">
                                <MousePointer2 className="w-5 h-5 mr-2 text-accent" />
                                Affiliate Performance
                            </h3>
                            <div className="space-y-4">
                                {/* Simple list of top affiliate items based on rows 16-17 */}
                                {data.slice(15, 18).map((row, i) => {
                                    if (!row[0]) return null;
                                    return (
                                        <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-black/20 border border-white/5">
                                            <span className="text-sm font-medium">{row[0]}</span>
                                            <div className="text-right">
                                                <div className="text-xs text-muted-foreground">Clicks</div>
                                                <div className="font-bold text-accent">{row[2]}</div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>

                        <div className="glass-panel p-6 rounded-xl border-l-4 border-l-primary flex items-start">
                            <div className="text-sm text-muted-foreground italic">
                                "次回の更新はスプレッドシートを更新後、CSVを配置するだけで反映されます。"
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default App;
