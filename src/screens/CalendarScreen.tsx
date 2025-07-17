import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const CalendarScreen = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const today = new Date();

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() - 1);
      return newDate;
    });
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentDate(prevDate => {
      const newDate = new Date(prevDate);
      newDate.setMonth(newDate.getMonth() + 1);
      return newDate;
    });
  };

  // 월 이름 배열
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // 요일 이름 배열
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // 현재 월의 첫 번째 날과 마지막 날 구하기
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  // 첫 번째 날의 요일 (0=일요일, 6=토요일)
  const startingDayOfWeek = firstDayOfMonth.getDay();

  // 현재 월의 총 일수
  const daysInMonth = lastDayOfMonth.getDate();

  // 이전 달의 마지막 일수
  const prevMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    0,
  );
  const daysInPrevMonth = prevMonth.getDate();

  // 캘린더 날짜 배열 생성
  const generateCalendarDays = () => {
    const days = [];

    // 이전 달의 날짜들 (회색으로 표시)
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        isCurrentMonth: false,
        isPrevMonth: true,
      });
    }

    // 현재 달의 날짜들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: day,
        isCurrentMonth: true,
        isPrevMonth: false,
      });
    }

    // 다음 달의 날짜들 (42개 셀을 채우기 위해)
    const totalCells = 42; // 6주 × 7일
    const remainingCells = totalCells - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      days.push({
        date: day,
        isCurrentMonth: false,
        isPrevMonth: false,
      });
    }

    return days;
  };

  const calendarDays = generateCalendarDays();

  // 날짜 선택 핸들러
  const handleDatePress = (day: any) => {
    if (!day.isCurrentMonth) return; // 현재 월의 날짜만 선택 가능

    const newSelectedDate = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day.date,
    );
    setSelectedDate(newSelectedDate);
  };

  // 오늘 날짜인지 확인
  const isToday = (day: any) => {
    if (!day.isCurrentMonth) return false;
    return (
      day.date === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  // 선택된 날짜인지 확인
  const isSelected = (day: any) => {
    if (!day.isCurrentMonth || !selectedDate) return false;
    return (
      day.date === selectedDate.getDate() &&
      currentDate.getMonth() === selectedDate.getMonth() &&
      currentDate.getFullYear() === selectedDate.getFullYear()
    );
  };

  // 날짜 셀 렌더링
  const renderDayCell = (day: any, index: number) => {
    const todayFlag = isToday(day);
    const selectedFlag = isSelected(day);

    // 선택된 날짜가 있으면 선택된 날짜만 표시, 없으면 오늘 날짜 표시
    const shouldShowCircle = selectedDate ? selectedFlag : todayFlag;

    return (
      <TouchableOpacity
        key={index}
        style={[styles.dayCell, shouldShowCircle && styles.selectedCell]}
        onPress={() => handleDatePress(day)}
      >
        <Text
          style={[
            styles.dayText,
            !day.isCurrentMonth && styles.otherMonthText,
            shouldShowCircle && styles.selectedText,
          ]}
        >
          {day.date}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.arrowButton}
          onPress={goToPreviousMonth}
        >
          <Text style={styles.arrowText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.monthYear}>
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </Text>

        <TouchableOpacity style={styles.arrowButton} onPress={goToNextMonth}>
          <Text style={styles.arrowText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* 요일 헤더 */}
      <View style={styles.weekHeader}>
        {dayNames.map((day, index) => (
          <View key={index} style={styles.weekDayCell}>
            <Text
              style={[
                styles.weekDayText,
                index === 0 && styles.sundayText, // 일요일
                index === 6 && styles.saturdayText, // 토요일
              ]}
            >
              {day}
            </Text>
          </View>
        ))}
      </View>

      {/* 캘린더 그리드 */}
      <View style={styles.calendarGrid}>
        {Array.from({ length: 6 }).map((_, weekIndex) => (
          <View key={weekIndex} style={styles.weekRow}>
            {calendarDays
              .slice(weekIndex * 7, (weekIndex + 1) * 7)
              .map((day, dayIndex) =>
                renderDayCell(day, weekIndex * 7 + dayIndex),
              )}
          </View>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 20,
  },
  arrowButton: {
    padding: 10,
  },
  arrowText: {
    fontSize: 24,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  monthYear: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'black',
  },
  weekHeader: {
    flexDirection: 'row',
    paddingBottom: 10,
  },
  weekDayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekDayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  sundayText: {
    color: '#FF3B30', // 빨간색
  },
  saturdayText: {
    color: '#007AFF', // 하늘색 (파란색)
  },
  calendarGrid: {
    flex: 1,
  },
  weekRow: {
    flexDirection: 'row',
  },
  dayCell: {
    flex: 1,
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  todayCell: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  selectedCell: {
    backgroundColor: '#007AFF',
    borderRadius: 20,
  },
  dayText: {
    fontSize: 16,
    color: 'black',
  },
  otherMonthText: {
    color: '#ccc',
  },
  todayText: {
    color: 'white',
    fontWeight: 'bold',
  },
  selectedText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CalendarScreen;
