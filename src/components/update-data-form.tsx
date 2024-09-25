'use client'

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format, addDays, differenceInDays } from 'date-fns';
import { cn, handleErrorApi } from '@/lib/utils';
import crawlApiRequest from '@/apiRequests/crawl';
import { toast } from '@/hooks/use-toast';
import { CheckCircleIcon } from 'lucide-react';
import BeatLoader from 'react-spinners/BeatLoader';

export default function UpdateDataForm() {

    const today = new Date();
    const tomorrow = addDays(today, 1);
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedDate, setSelectedDate] = useState<Date>(tomorrow);
    const [dateIndex, setDateIndex] = useState<number | undefined>();
    const [loading, setLoading] = useState<boolean>(false);


    const handleDateSelect = (date: Date | undefined) => {
        if (date) {
            setSelectedDate(date);
            const index = differenceInDays(date, today) + 1;
            setDateIndex(index);
        }
    };

    const handelSubmit = async () => {
        if (loading) return;
        setLoading(true);

        try {
            const crawlResponse = await crawlApiRequest.crawl(selectedType, dateIndex);
            toast({
                description: (
                    <div className="flex items-center">
                        <CheckCircleIcon className="w-5 h-5 text-green-500 mr-2" />
                        <span>{crawlResponse.payload.message}</span>
                    </div>
                )
            });
        } catch (error) {
            console.log(error);
            handleErrorApi({
                error
            });
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="p-6 max-w-md mx-auto">
            <div className="space-y-2">
                <h3 className="text-md font-medium">Chọn loại data:</h3>
                <div className="flex space-x-4">
                    <Button
                        variant={selectedType === 'show' ? 'default' : 'outline'}
                        onClick={() => setSelectedType('show')}
                    >
                        Show
                    </Button>
                    <Button
                        variant={selectedType === 'movie' ? 'default' : 'outline'}
                        onClick={() => setSelectedType('movie')}
                    >
                        Movie
                    </Button>
                </div>
            </div>

            {selectedType === 'show' && (
                <div className="space-y-2">
                    <h3 className="text-md font-medium">Chọn ngày:</h3>
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className={cn(
                                "w-full justify-between",
                                !selectedDate && "text-muted-foreground"
                            )}>
                                {selectedDate ? format(selectedDate, 'PPP') : "Chọn 1 ngày"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="p-2 w-auto">
                            <Calendar
                                mode="single"
                                selected={selectedDate}
                                onSelect={handleDateSelect}
                                disabled={(date) => date < today || date > addDays(today, 7)}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
            )}

            {/* Submit Button */}
            <div className="pt-4">
                <Button
                    variant="default"
                    className="w-full"
                    disabled={!selectedType || loading}
                    onClick={handelSubmit}
                >
                    {loading ? (
                        <BeatLoader color="currentColor" size={8} loading={loading} />
                    ) : (
                        'Update'
                    )}
                </Button>
            </div>
        </div>
    );
}
