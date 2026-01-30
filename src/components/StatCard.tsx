import { motion } from 'framer-motion';

interface CardProps {
    title: string;
    value: string | number;
    subValue?: string;
    icon?: React.ReactNode;
    delay?: number;
}

export const StatCard = ({ title, value, subValue, icon, delay = 0 }: CardProps) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: delay * 0.1 }}
            className="glass-panel p-6 rounded-xl flex flex-col justify-between hover:border-primary/50 transition-colors duration-300"
        >
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-muted-foreground text-sm font-medium uppercase tracking-wider">{title}</h3>
                {icon && <div className="text-primary text-xl">{icon}</div>}
            </div>
            <div>
                <div className="text-3xl font-bold text-foreground mb-1">{value}</div>
                {subValue && <div className="text-sm text-accent">{subValue}</div>}
            </div>
        </motion.div>
    );
};
